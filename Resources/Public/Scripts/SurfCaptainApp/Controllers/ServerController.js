/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ServerController', ServerController);

    /* @ngInject */
    function ServerController($scope, $controller, PresetRepository, ValidationService, SettingsRepository, MarkerService, PresetService, toaster, ProjectRepository) {

        var self = this;

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        function ServerControllerException(message) {
            this.name = 'ServerControllerException';
            this.message = message;
        }
        ServerControllerException.prototype = new Error();
        ServerControllerException.prototype.constructor = ServerControllerException;

        $scope.finished = false;
        $scope.currentPreset = {};
        $scope.messages = [];
        $scope.serverNames = [];


        /**
         * @return void
         */
        this.setServerNames = function () {
            var property;
            $scope.serverNames = [];
            for (property in $scope.servers) {
                if ($scope.servers.hasOwnProperty(property)) {
                    $scope.serverNames.push(property);
                }
            }
        };

        /**
         * Sets all serverNames that are already in use as
         * unavailable in the nameSuggestions array in the $scope
         *
         * @return {void}
         */
        this.setTakenServerNamesAsUnavailableSuggestions = function () {
            var i = 0, numberOfNameSuggestions, serverName;

            if ($scope.serverNames.length) {
                numberOfNameSuggestions = $scope.nameSuggestions.length;

                for (i; i < numberOfNameSuggestions; i++) {
                    serverName = $scope.generateServerName($scope.nameSuggestions[i].suffix);
                    $scope.nameSuggestions[i].available = !ValidationService.doesArrayContainItem($scope.serverNames, serverName);
                }
            }
        };

        /**
         * nameSuggestions are retrieved from the Settings.yaml
         *
         * Example configuration:
         *
         * Lightwerk:
         *   SurfCaptain:
         *     frontendSettings
         *       nameSuggestions:
         *         live: 'Production'
         *         qa: 'Production/Qa'
         *         staging: 'Production/Staging'
         *         test: 'Testing'
         *         dev: 'Development'
         *
         * It populates the $scope.nameSuggestions array with objects like
         *
         * {
         *   suffix: live,
         *   available: true,
         *   context: 'Production'
         * }
         *
         * @param {object} nameSuggestions
         * @return {void}
         */
        this.generateNameSuggestions = function (nameSuggestions) {
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

        /**
         * Here are FrontendSettings regarding Server Management
         * taken into account. The settings are retrieved from
         * Settings.yaml.
         *
         * The considered settings are
         *   * contexts - a comma separated list of allowed TYPO3_CONTEXTs
         *   * nameSuggestions - @see generateNameSuggestions
         *   * defaultDeploymentPath - the field deploymentPath of the new server
         *     server form will be prefilled with this string.
         *
         * @return {void}
         */
        this.handleSettings = function () {
            var docRoot;
            if (angular.isUndefined($scope.settings)) {
                return;
            }
            $scope.contexts = '';
            if (angular.isDefined($scope.settings.contexts)) {
                $scope.contexts = $scope.settings.contexts.split(',');
            }
            if (angular.isDefined($scope.settings.nameSuggestions)) {
                self.generateNameSuggestions($scope.settings.nameSuggestions);
            }
            if (angular.isDefined($scope.settings.defaultDeploymentPath)) {
                docRoot = $scope.settings.defaultDeploymentPath;
                if (ValidationService.doesStringContainSubstring(docRoot, '{{')) {
                    docRoot = MarkerService.replaceMarkers(docRoot, $scope.project);
                }
                if (ValidationService.doesStringContainSubstring(docRoot, '{{')) {
                    $scope.newPreset.options.deploymentPath = MarkerService.getStringBeforeFirstMarker(docRoot);
                    $scope.newPreset.options.deploymentPathWithMarkers = docRoot;
                } else {
                    $scope.newPreset.options.deploymentPath = docRoot;
                }
            }
        };

        this.successCallback = function (response) {
            $scope.finished = true;
            $scope.servers = response.repository.presets;
            self.setServerNames();
            if (angular.isDefined($scope.nameSuggestions)) {
                self.setTakenServerNamesAsUnavailableSuggestions();
            }
            if ($scope.servers.length === 0) {
                toaster.pop(
                    'note',
                    'No Servers yet!',
                    'FYI: There are no servers for project <span class="uppercase">' + $scope.name  + '</span> yet. Why dont you create one, hmm?',
                    4000,
                    'trustedHtml'
                );
            }
        };

        this.failureCallback = function () {
            $scope.finished = true;
            toaster.pop(
                'error',
                'Request failed!',
                'The servers could not be received. Please try again later..'
            );
        };

        /**
         * @return {void}
         */
        $scope.getAllServers = function (cache) {
            $scope.newPreset.options.repositoryUrl = $scope.project.repositoryUrl;
            if (cache === false) {
                ProjectRepository.getFullProjectByRepositoryUrlFromServer($scope.project.repositoryUrl).then(
                    self.successCallback,
                    self.failureCallback
                );
            } else {
                ProjectRepository.getFullProjectByRepositoryUrl($scope.project.repositoryUrl).then(
                    self.successCallback,
                    self.failureCallback
                );
            }
        };

        /**
         * Takes a suffix and tries to replace a {{suffix}} marker
         * within the document root. Stores the returning string
         * in the deploymentPath property of the newPreset.
         *
         * @param {string} suffix
         * @return {void}
         */
        $scope.setDeploymentPath = function (suffix) {
            var docRoot;
            if (angular.isDefined($scope.newPreset.options.deploymentPathWithMarkers)) {
                docRoot = MarkerService.replaceMarkers(
                    $scope.newPreset.options.deploymentPathWithMarkers,
                    {suffix: suffix}
                );
                $scope.newPreset.options.deploymentPath = docRoot;
            }

        };

        /**
         * Adds a Server (preset) to the collection of presets.
         * Indicates the success or failure with a flashMessage.
         *
         * @param {object} server
         * @return {void}
         */
        $scope.addServer = function (server) {
            $scope.finished = false;
            if (angular.isDefined(server.options.deploymentPathWithMarkers)) {
                delete server.options.deploymentPathWithMarkers;
            }
            PresetRepository.addServer(server).then(
                function () {
                    $scope.newPreset = PresetService.getNewPreset($scope.settings);
                    $scope.newServerForm.$setPristine();
                    self.handleSettings();
                    $scope.getAllServers(false);
                    toaster.pop(
                        'success',
                        'Server created!',
                        'The Server "' + server.nodes[0].name + '" was successfully created.'
                    );
                },
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.'
                    );
                }
            );
        };

        /**
         * Applies a server suffix to the current project name.
         *
         * @param {string} suffix
         * @returns {string}
         * @throws {ServerControllerException}
         */
        $scope.generateServerName = function (suffix) {
            if (angular.isUndefined($scope.project)) {
                throw new ServerControllerException('No project given.');
            }
            if (angular.isUndefined($scope.project.identifier)) {
                throw new ServerControllerException('Project got no identifier.');
            }
            return $scope.project.identifier + '-' + suffix;
        };

        /**
         * Watches for the project property. If it gets filled,
         * further requests are triggered.
         *
         * @return {void}
         */
        $scope.$watch('project', function (newValue) {
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
}());