/*jslint node: true, plusplus:true */
/*global surfCaptain, angular*/

// TODO uinittests

'use strict';
surfCaptain.controller('ServerController', [
    '$scope',
    '$controller',
    'ServerRepository',
    'ValidationService',
    'SettingsRepository',
    'MarkerService',
    'PresetService',
    function ($scope, $controller, ServerRepository, ValidationService, SettingsRepository, MarkerService, PresetService) {

        var self = this, generateNameSuggestions, replaceMarkers;

        $scope.currentPreset = {};
        $scope.contexts = [
            'Production', 'Development', 'Staging'
        ];


        /**
         * Sets all serverNames that are already in use as
         * unavailable in the nameSuggestions array in the $scope
         *
         * @return {void}
         */
        this.setTakenServerNamesAsUnavailableSuggestions = function () {
            var i = 0, numberOfNameSuggestions, serverName, serverNames = [], property;

            for (property in $scope.servers) {
                if ($scope.servers.hasOwnProperty(property)) {
                    serverNames.push(property);
                }
            }

            if (serverNames.length) {
                numberOfNameSuggestions = $scope.nameSuggestions.length;

                for (i; i < numberOfNameSuggestions; i++) {
                    serverName = $scope.generateServerName($scope.nameSuggestions[i].suffix);
                    $scope.nameSuggestions[i].available = !ValidationService.doesArrayContainItem(serverNames, serverName);
                }
            }
        };

        /**
         * @return {void}
         */
        this.getAllServers = function () {
            $scope.newPreset.options.repositoryUrl = $scope.project.ssh_url_to_repo;
            ServerRepository.getServers($scope.project.ssh_url_to_repo).then(
                function (response) {
                    $scope.servers = response.presets;
                    // TODO remove Spinner
                    if (angular.isDefined($scope.nameSuggestions)) {
                        self.setTakenServerNamesAsUnavailableSuggestions();
                    }
                }
            );
        };

        /**
         *
         * @return {void}
         */
        this.handleSettings = function () {
            var docRoot;
            if (angular.isDefined($scope.settings.nameSuggestions)) {
                generateNameSuggestions($scope.settings.nameSuggestions);
            }
            if (angular.isDefined($scope.settings.defaultDocumentRoot)) {
                docRoot = $scope.settings.defaultDocumentRoot;
                if (ValidationService.doesStringContainSubstring(docRoot, '{{')) {
                    docRoot = MarkerService.replaceMarkers(docRoot, $scope.project);
                }
                if (ValidationService.doesStringContainSubstring(docRoot, '{{')) {
                    $scope.newPreset.options.documentRoot = MarkerService.getStringBeforeFirstMarker(docRoot);
                    $scope.newPreset.options.documentRootWithMarkers = docRoot;
                } else {
                    $scope.newPreset.options.documentRoot = docRoot;
                }
            }
        };

        /**
         *
         * @param {object} nameSuggestions
         * @return {void}
         */
        generateNameSuggestions = function (nameSuggestions) {
            var nameSuggestion, item;
            $scope.nameSuggestions = [];
            for (nameSuggestion in nameSuggestions) {
                if (nameSuggestions.hasOwnProperty(nameSuggestion)) {
                    item = {
                        suffix: nameSuggestion,
                        available: true,
                        context: nameSuggestions[nameSuggestion]
                    };
                    $scope.nameSuggestions.push(item);
                }
            }
        };

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        $scope.setDocumentRoot = function (suffix) {
            var docRoot;
            if (angular.isDefined($scope.newPreset.options.documentRootWithMarkers)) {
                docRoot = MarkerService.replaceMarkers(
                    $scope.newPreset.options.documentRootWithMarkers,
                    {suffix: suffix}
                );
                $scope.newPreset.options.documentRoot = docRoot;
            }

        };

        $scope.setCurrentPreset = function (preset) {
            $scope.currentPreset = preset;
        };

        $scope.deleteServer = function (server) {
            // TODO Spinner
            ServerRepository.deleteServer(server).then(
                function (response) {
                    self.getAllServers();
                },
                function (response) {
                    // an error occurred
                }
            );
        };

        $scope.updateServer = function (server) {
            ServerRepository.updateServer(server);
        };

        $scope.addServer = function (server) {
            ServerRepository.addServer(server).then(
                function (response) {
                    // TODO Animation
                    $scope.newPreset = PresetService.getNewPreset($scope.settings);
                    $scope.newServerForm.$setPristine();
                    self.getAllServers();
                },
                function (response) {
                    // an error occurred
                }
            );
        };

        /**
         * Validates the updated Host string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        $scope.updateHost = function (data) {
            return ValidationService.hasLength(data, 1, 'Host must not be empty!');
        };

        /**
         * Validates the updated DocumentRoot string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        $scope.updateDocumentRoot = function (data) {
            var res = ValidationService.hasLength(data, 1, 'DocumentRoot is required!');
            if (res === true) {
                return ValidationService.doesLastCharacterMatch(data, '/', 'DocumentRoot must end with "/"!');
            }
            return res;
        };

        /**
         * Validates the updated Username string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        $scope.updateUsername = function (data) {
            return ValidationService.hasLength(data, 1, 'User must not be empty!');
        };

        /**
         * Validates the updated Context string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        $scope.updateContext = function (data) {
            return ValidationService.doesArrayContainItem($scope.contexts, data, 'Context is not valid!');
        };

        /**
         * Applies a server suffix to the current project name.
         *
         * @param {string} suffix
         * @returns {string}
         */
        $scope.generateServerName = function (suffix) {
            return $scope.project.name + '-' + suffix;
        };

        /**
         * Watches for the project property. If it gets filled,
         * further requests are triggered.
         *
         * @return {void}
         */
        $scope.$watch('project', function (newValue, oldValue) {
            if (angular.isDefined(newValue.name)) {
                SettingsRepository.getSettings().then(
                    function (response) {
                        $scope.settings = response;
                        $scope.newPreset = PresetService.getNewPreset($scope.settings);
                        self.handleSettings();
                        self.getAllServers();
                    },
                    function () {
                        $scope.newPreset = PresetService.getNewPreset();
                        self.getAllServers();
                    }
                );
            }
        });
    }
]);