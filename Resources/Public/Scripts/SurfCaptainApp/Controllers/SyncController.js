/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').controller('SyncController', [
    '$scope',
    '$controller',
    'PresetRepository',
    'CONFIG',
    'FlashMessageService',
    'SEVERITY',
    'ProjectRepository',
    'PresetService',
    'SettingsRepository',
    'DeploymentRepository',
    '$location',
    function ($scope, $controller, PresetRepository, CONFIG, FlashMessageService, SEVERITY, ProjectRepository, PresetService, SettingsRepository, DeploymentRepository, $location) {

        var self = this;

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        /**
         * @return {void}
         */
        this.addFailureFlashMessage = function () {
            $scope.finished = true;
            $scope.messages = FlashMessageService.addFlashMessage(
                'Request failed!',
                'API call failed. Sync not possible.',
                SEVERITY.error,
                $scope.name + '-sync-call-failed'
            );
        };

        /**
         * Fills $scope.contexts with configured contexts if
         * some were configured in frontend settings.
         *
         * @return {void}
         */
        this.setContexts = function () {
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = [];
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
                    }
                }
            );
        };

        /**
         * Requests all global Servers from the API and
         * stores publish them to the scope via $scope.globalServers
         *
         * @return {void}
         */
        this.setGlobalServers = function () {
            PresetRepository.getGlobalServers('').then(
                function (response) {
                    $scope.globalServers = response.presets;
                },
                function (response) {
                    self.addFailureFlashMessage();
                }
            );
        };

        /**
         * Initialization of SyncController. This function is called
         * immediately after creation of the controller.
         *
         * @return {void}
         */
        this.init = function () {
            $scope.servers = [];
            $scope.finished = false;
            $scope.currentSource = {};
            $scope.currentTarget = {};
            self.setContexts();
            self.setGlobalServers();
        };

        this.init();

        /**
         * @param {object} preset
         * @returns {string}
         */
        $scope.sourceDisplay = function (preset) {
            if (angular.isUndefined($scope.currentSource.applications)) {
                return '';
            }
            if ($scope.currentSource === preset) {
                return '';
            }
            return 'disabled';
        };

        /**
         * @param {object} preset
         * @returns {string}
         */
        $scope.targetDisplay = function (preset) {
            if (angular.isUndefined($scope.currentTarget.applications)) {
                return '';
            }
            if ($scope.currentTarget === preset) {
                return '';
            }
            return 'disabled';
        };

        /**
         * @param {string} context
         * @returns {string}
         */
        $scope.getRootContext = function (context) {
            return PresetService.getRootContext(context, $scope.contexts);
        };

        /**
         * @param {object} preset
         * @return {void}
         */
        $scope.setCurrentSource = function (preset) {
            $scope.currentSource = preset;
        };

        /**
         * @param {object} preset
         * @return {void}
         */
        $scope.setCurrentTarget = function (preset) {
            $scope.currentTarget = preset;
        };

        /**
         * @param {object} source - source node
         * @param {object} target - target node
         * @return {void}
         */
        $scope.sync = function (source, target) {
            target.applications[0].type = CONFIG.applicationTypes.syncTYPO3;
            target.applications[0].options.sourceNode = source.applications[0].nodes[0];
            target.applications[0].options.repositoryUrl = $scope.project.repositoryUrl;
            DeploymentRepository.addDeployment(target).then(
                function (response) {
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'OK!',
                        target.applications[0].nodes[0].name + ' will be synchronized with ' +
                            source.applications[0].nodes[0].name + '.',
                        SEVERITY.ok
                    );
                    ProjectRepository.updateFullProjectInCache($scope.project.repositoryUrl);
                    $location.path('deployments/' + response.deployment.__identity);
                },
                self.addFailureFlashMessage
            );
        };

        /**
         * As soon as we receive the repositoryUrl, we
         * make further requests.
         */
        $scope.$watch('project', function (project) {
            if (angular.isUndefined(project.repositoryUrl)) {
                return;
            }

            ProjectRepository.getFullProjectByRepositoryUrl(project.repositoryUrl).then(
                function (response) {
                    var property,
                        presets = response.repository.presets;
                    for (property in presets) {
                        if (presets.hasOwnProperty(property)) {
                            if (angular.isUndefined(presets[property].applications[0].type) || presets[property].applications[0].type === CONFIG.applicationTypes.syncTYPO3) {
                                $scope.servers.push(presets[property]);
                            }
                        }
                    }
                    $scope.finished = true;
                    if ($scope.servers.length === 0) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'No Servers yet!',
                            'FYI: There are no servers for project <span class="uppercase">' + $scope.name  + '</span> yet. Why dont you create one, hmm?',
                            SEVERITY.info,
                            $scope.name + '-no-servers'
                        );
                    }
                },
                function () {
                    self.addFailureFlashMessage();
                }
            );
        });
    }
]);