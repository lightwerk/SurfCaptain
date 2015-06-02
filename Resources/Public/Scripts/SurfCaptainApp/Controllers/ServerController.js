/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ServerController', ServerController);

    /* @ngInject */
    function ServerController($scope, $controller, PresetRepository, ValidationService, SettingsRepository, MarkerService, PresetService, FlashMessageService, ProjectRepository) {

        var self = this;

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        function ServerControllerException(message) {
            this.name = 'ServerControllerException';
            this.message = message;
        }
        ServerControllerException.prototype = new Error();
        ServerControllerException.prototype.constructor = ServerControllerException;

        // properties of the vm
        $scope.finished = false;
        $scope.currentPreset = {};
        $scope.messages = [];
        $scope.serverNames = [];

        // methods published to the view
        $scope.getAllServers = getAllServers;
        $scope.setDeploymentPath = setDeploymentPath;
        $scope.addServer = addServer;
        $scope.generateServerName = generateServerName;

        // internal methods
        this.setServerNames = setServerNames;
        this.setTakenServerNamesAsUnavailableSuggestions = setTakenServerNamesAsUnavailableSuggestions;
        this.generateNameSuggestions = generateNameSuggestions;
        this.handleSettings = handleSettings;
        this.successCallback = successCallback;
        this.failureCallback = failureCallback;


        /**
         * @return void
         */
        function setServerNames() {
            var property;
            $scope.serverNames = [];
            for (property in $scope.servers) {
                if ($scope.servers.hasOwnProperty(property)) {
                    $scope.serverNames.push(property);
                }
            }
        }

        /**
         * Sets all serverNames that are already in use as
         * unavailable in the nameSuggestions array in the $scope
         *
         * @return {void}
         */
        function setTakenServerNamesAsUnavailableSuggestions() {
            var i = 0, numberOfNameSuggestions, serverName;

            if ($scope.serverNames.length) {
                numberOfNameSuggestions = $scope.nameSuggestions.length;

                for (i; i < numberOfNameSuggestions; i++) {
                    serverName = $scope.generateServerName($scope.nameSuggestions[i].suffix);
                    $scope.nameSuggestions[i].available = !ValidationService.doesArrayContainItem($scope.serverNames, serverName);
                }
            }
        }

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
        function generateNameSuggestions(nameSuggestions) {
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
        }

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
        function handleSettings() {
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
        }

        function successCallback(response) {
            $scope.finished = true;
            $scope.servers = response.repository.presets;
            self.setServerNames();
            if (angular.isDefined($scope.nameSuggestions)) {
                self.setTakenServerNamesAsUnavailableSuggestions();
            }
            if ($scope.servers.length === 0) {
                FlashMessageService.addInfoFlashMessage(
                    'No Servers yet!',
                    'FYI: There are no servers for project <span class="uppercase">' + $scope.name  + '</span> yet. Why dont you create one, hmm?'
                );
            }
        }

        function failureCallback(response) {
            $scope.finished = true;
            FlashMessageService.addErrorFlashMessageFromResponse(
                response,
                'Request failed!',
                'The servers could not be received. Please try again later..'
            );
        }

        /**
         * @return {void}
         */
        function getAllServers(cache) {
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
        }

        /**
         * Takes a suffix and tries to replace a {{suffix}} marker
         * within the document root. Stores the returning string
         * in the deploymentPath property of the newPreset.
         *
         * @param {string} suffix
         * @return {void}
         */
        function setDeploymentPath(suffix) {
            var docRoot;
            if (angular.isDefined($scope.newPreset.options.deploymentPathWithMarkers)) {
                docRoot = MarkerService.replaceMarkers(
                    $scope.newPreset.options.deploymentPathWithMarkers,
                    {suffix: suffix}
                );
                $scope.newPreset.options.deploymentPath = docRoot;
            }
        }

        /**
         * Adds a Server (preset) to the collection of presets.
         * Indicates the success or failure with a flashMessage.
         *
         * @param {object} server
         * @return {void}
         */
         function addServer(server) {
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
                    FlashMessageService.addSuccessFlashMessage(
                        'Server created!',
                        'The Server "' + server.nodes[0].name + '" was successfully created.'
                    );
                },
                function (response) {
                    $scope.finished = true;
                    FlashMessageService.addErrorFlashMessageFromResponse(
                        response,
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.'
                    );
                }
            );
        }

        /**
         * Applies a server suffix to the current project name.
         *
         * @param {string} suffix
         * @returns {string}
         * @throws {ServerControllerException}
         */
        function generateServerName(suffix) {
            if (angular.isUndefined($scope.project)) {
                throw new ServerControllerException('No project given.');
            }
            if (angular.isUndefined($scope.project.identifier)) {
                throw new ServerControllerException('Project got no identifier.');
            }
            return $scope.project.identifier + '-' + suffix;
        }

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