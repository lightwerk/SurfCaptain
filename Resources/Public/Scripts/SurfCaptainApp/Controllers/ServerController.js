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
    function ($scope, $controller, ServerRepository, ValidationService, SettingsRepository, MarkerService) {

        var getAllServers, setTakenServerNamesAsUnavailableSuggestions, getNewPreset, handleSettings, generateNameSuggestions, replaceMarkers;

        $scope.currentPreset = {};
        $scope.defaultUser = '';
        $scope.defaultDocumentRoot = '';
        $scope.contexts = [
            'Production', 'Development', 'Staging'
        ];

        /**
         * Returns the skeleton of a preset object
         *
         * @returns {object}
         */
        getNewPreset = function () {
            return {
                "options": {
                    "repositoryUrl": '',
                    "documentRoot": $scope.defaultDocumentRoot,
                    "context": ''
                },
                "nodes": [
                    {
                        "name": '',
                        "hostname": '',
                        "username": $scope.defaultUser
                    }
                ]
            };
        };

        $scope.newPreset = getNewPreset();

        /**
         * Sets all serverNames that are already in use as
         * unavailable in the nameSuggestions array in the $scope
         *
         * @return {void}
         */
        setTakenServerNamesAsUnavailableSuggestions = function () {
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
                    $scope.nameSuggestions[i].available = !ValidationService.doesArrayContainsItem(serverNames, serverName);
                }
            }
        };

        /**
         * @return {void}
         */
        getAllServers = function () {
            $scope.newPreset.options.repositoryUrl = $scope.project.ssh_url_to_repo;
            ServerRepository.getServers($scope.project.ssh_url_to_repo).then(
                function (response) {
                    $scope.servers = response.presets;
                    // TODO remove Spinner
                    if (angular.isDefined($scope.nameSuggestions)) {
                        setTakenServerNamesAsUnavailableSuggestions();
                    }
                }
            );
        };

        /**
         *
         * @return {void}
         */
        handleSettings = function () {
            var docRoot;
            if (angular.isDefined($scope.settings.nameSuggestions)) {
                generateNameSuggestions($scope.settings.nameSuggestions);
            }
            if (angular.isDefined($scope.settings.defaultUser)) {
                $scope.defaultUser = $scope.settings.defaultUser;
                $scope.newPreset.nodes[0].username = $scope.defaultUser;
            }
            if (angular.isDefined($scope.settings.defaultDocumentRoot)) {
                docRoot = $scope.settings.defaultDocumentRoot;
                if (docRoot.indexOf('{{') !== -1) {
                    docRoot = MarkerService.replaceMarkers(docRoot, $scope.project);
                }
                $scope.defaultDocumentRoot = docRoot;
                $scope.newPreset.options.documentRoot = docRoot;
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

        $scope.setCurrentPreset = function (preset) {
            $scope.currentPreset = preset;
        };

        $scope.deleteServer = function (server) {
            // TODO Spinner
            ServerRepository.deleteServer(server).then(
                function (response) {
                    getAllServers();
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
                    $scope.newPreset = getNewPreset();
                    $scope.newServerForm.$setPristine();
                    getAllServers();
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
            return ValidationService.doesArrayContainsItem($scope.contexts, data, 'Context is not valid!');
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
                        $scope.settings = response.frontendSettings;
                        handleSettings();
                        getAllServers();
                    },
                    function () {
                        getAllServers();
                    }
                );
            }
        });
    }
]);