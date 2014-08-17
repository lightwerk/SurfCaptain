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
    'FlashMessageService',
    'SEVERITY',
    function ($scope, $controller, ServerRepository, ValidationService, SettingsRepository, MarkerService, PresetService, FlashMessageService, SEVERITY) {

        var self = this, generateNameSuggestions, replaceMarkers;

        $scope.finished = false;
        $scope.currentPreset = {};
        $scope.messages = [];
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
        $scope.getAllServers = function () {
            $scope.newPreset.options.repositoryUrl = $scope.project.ssh_url_to_repo;
            ServerRepository.getServers($scope.project.ssh_url_to_repo).then(
                function (response) {
                    $scope.finished = true;
                    $scope.servers = response.presets;
                    if (angular.isDefined($scope.nameSuggestions)) {
                        self.setTakenServerNamesAsUnavailableSuggestions();
                    }
                    if ($scope.servers.length === 0) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'No Servers yet!',
                            'FYI: There are no servers for project <span class="uppercase">' + $scope.name  + '</span> yet. Why dont you create one, hmm?',
                            SEVERITY.info
                        );
                    }
                },
                function (response) {
                    $scope.finished = true;
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Request failed!',
                        'The servers could not be received. Please try again later..',
                        SEVERITY.error,
                        'server-request-failed'
                    );
                }
            );
        };

        /**
         *
         * @return {void}
         */
        this.handleSettings = function () {
            var docRoot;
            if (angular.isUndefined($scope.settings)) {
                return;
            }
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

        $scope.addServer = function (server) {
            $scope.finished = false;
            ServerRepository.addServer(server).then(
                function (response) {
                    $scope.newPreset = PresetService.getNewPreset($scope.settings);
                    $scope.newServerForm.$setPristine();
                    self.handleSettings();
                    $scope.getAllServers();
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Server created!',
                        'The Server "' + server.nodes[0].name + '" was successfully created.',
                        SEVERITY.ok
                    );
                },
                function (response) {
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.',
                        SEVERITY.error
                    );
                }
            );
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
                        $scope.getAllServers();
                    },
                    function () {
                        $scope.newPreset = PresetService.getNewPreset();
                        $scope.getAllServers();
                    }
                );
            }
        });
    }
]);