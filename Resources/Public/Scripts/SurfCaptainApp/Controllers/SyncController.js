/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('SyncController', SyncController);

    /* @ngInject */
    function SyncController($scope, $controller, PresetRepository, CONFIG, toaster, ProjectRepository, SettingsRepository, DeploymentRepository, $location) {

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        // Inherit from AbstractApplicationController
        angular.extend(this, $controller('AbstractApplicationController', {$scope: $scope}));

        var self = this;

        $scope.servers = [];
        $scope.finished = false;
        $scope.currentSource = {};
        $scope.currentTarget = {};

        /**
         * @return {void}
         */
        this.addFailureFlashMessage = function () {
            $scope.finished = true;
            toaster.pop(
                'error',
                'Request failed!',
                'API call failed. Sync not possible.'
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
                function () {
                    self.addFailureFlashMessage();
                }
            );
        };

        /**
         * Takes a set of presets, recieved from the API and fills the
         * $scope.servers with any preset that have no or one of the
         * allowed applicationTypes from CONFIG.
         *
         * @param {object} presets
         * @return {void}
         */
        this.setServersFromPresets = function (presets) {
            var property;
            for (property in presets) {
                if (presets.hasOwnProperty(property)) {
                    if (angular.isUndefined(presets[property].applications[0].type) ||
                        presets[property].applications[0].type === CONFIG.applicationTypes.syncTYPO3) {
                        $scope.servers.push(presets[property]);
                    }
                }
            }
            self.setPreconfiguredServer();
        };

        /**
         * It is possible to assign a server as sync source
         * as the GET parameter server. This method checks if
         * that parameter exists and is a valid server. If
         * this is the case, setCurrentSource() is called to
         * trigger step2.
         *
         * @return {void}
         */
        this.setPreconfiguredServer = function () {
            var searchObject = $location.search(),
                preconfiguredPreset;
            if (angular.isDefined(searchObject.server)) {
                preconfiguredPreset = $scope.servers.filter(function (preset) {
                    return preset.applications[0].nodes[0].name.toLowerCase() === searchObject.server.toLowerCase();
                });
                if (preconfiguredPreset.length) {
                    $scope.setCurrentSource(preconfiguredPreset[0]);
                }
            }
        };

        /**
         * Initialization of SyncController. This function is called
         * immediately after creation of the controller.
         *
         * @return {void}
         */
        this.init = function () {
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
            target.applications[0].options.sourceNode.deploymentPath = source.applications[0].options.deploymentPath;
            target.applications[0].options.repositoryUrl = $scope.project.repositoryUrl;
            DeploymentRepository.addDeployment(target).then(
                function (response) {
                    toaster.pop(
                        'success',
                        'OK!',
                        target.applications[0].nodes[0].name + ' will be synchronized with ' +
                        source.applications[0].nodes[0].name + '.'
                    );
                    ProjectRepository.updateFullProjectInCache($scope.project.repositoryUrl);
                    $location.path('project/' + $scope.name + '/deployment/' + response.deployment.__identity);
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
                    self.setServersFromPresets(response.repository.presets);
                    $scope.finished = true;
                    if ($scope.servers.length === 0) {
                        toaster.pop(
                            'note',
                            'No Servers yet!',
                            'FYI: There are no servers for project <span class="uppercase">' + $scope.name  + '</span> yet. Why dont you create one, hmm?',
                            4000,
                            'trustedHtml'
                        );
                    }
                },
                function () {
                    self.addFailureFlashMessage();
                }
            );
        });
    }
}());