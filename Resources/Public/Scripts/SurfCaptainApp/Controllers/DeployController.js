/* global angular,jQuery */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('DeployController', DeployController);

    /* @ngInject */
    function DeployController($scope, $controller, ProjectRepository, SEVERITY, FlashMessageService, CONFIG, DeploymentRepository, $location, PresetRepository, SettingsRepository, UtilityService) {

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        // Inherit from AbstractApplicationController
        angular.extend(this, $controller('AbstractApplicationController', {$scope: $scope}));

        var loadingString = 'loading ...',
            self = this;

        function DeployControllerException(message) {
            this.name = 'DeployControllerException';
            this.message = message;
        }

        DeployControllerException.prototype = new Error();
        DeployControllerException.prototype.constructor = DeployControllerException;

        $scope.deployableCommits = [
            {
                name: loadingString,
                group: 'Tags'
            },
            {
                name: loadingString,
                group: 'Branches'
            }
        ];
        $scope.servers = [];
        $scope.error = false;
        $scope.finished = false;
        $scope.currentPreset = {};
        $scope.tags = [];

        /**
         * @param {string} message
         * @param {boolean} unique
         * @return {void}
         */
        this.addFailureFlashMessage = function (message, unique) {
            $scope.finished = true;
            $scope.messages = FlashMessageService.addFlashMessage(
                'Error!',
                message,
                SEVERITY.error,
                unique ? 'deployment-project-call-failed' : undefined
            );
            $scope.error = true;
        };

        /**
         * @returns {object}
         * @throws DeployControllerException
         */
        this.getCurrentCommit = function () {
            var commits = $scope.deployableCommits.filter(function (commit) {
                return commit.identifier === $scope.selectedCommit;
            });
            if (angular.isUndefined(commits[0]) || commits === null || commits.length > 1) {
                throw new DeployControllerException('Something went wrong with the chosen Commit');
            }
            return commits[0];
        };

        /**
         * @param {object} preset
         * @return {void}
         */
        $scope.setCurrentPreset = function (preset) {
            $scope.currentPreset = preset;
            if (angular.isDefined($scope.selectedCommit) && $scope.selectedCommit !== '') {
                $scope.setCommitInCurrentPreset();
            }
        };

        $scope.deploy = function (preset) {
            if (preset === $scope.currentPreset) {
                if (angular.isUndefined($scope.currentPreset.applications[0].type)) {
                    $scope.currentPreset.applications[0].type = CONFIG.applicationTypes.deployTYPO3;
                }
                if (angular.isDefined($scope.currentPreset.applications[0].options.deploymentPathWithMarkers)) {
                    delete $scope.currentPreset.applications[0].options.deploymentPathWithMarkers;
                }
                if (angular.isUndefined($scope.currentPreset.applications[0].options.repositoryUrl) || $scope.currentPreset.applications[0].options.repositoryUrl === '') {
                    $scope.currentPreset.applications[0].options.repositoryUrl = $scope.project.repositoryUrl;
                }
                DeploymentRepository.addDeployment($scope.currentPreset).then(
                    function (response) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'OK!',
                            $scope.currentCommit.type + ' ' + $scope.currentCommit.name + ' will be shortly deployed onto ' +
                            $scope.currentPreset.applications[0].nodes[0].name + '! You can cancel the deployment while it is still waiting.',
                            SEVERITY.ok
                        );
                        ProjectRepository.updateFullProjectInCache($scope.project.repositoryUrl);
                        $location.path('project/' + $scope.name + '/deployment/' + response.deployment.__identity);
                    },
                    function () {
                        self.addFailureFlashMessage('Deployment configuration could not be submitted successfully. Try again later.', false);
                    }
                );
            }
        };

        /**
         * @return {void}
         */
        $scope.setCommitInCurrentPreset = function () {
            try {
                $scope.currentCommit = self.getCurrentCommit();
                switch ($scope.currentCommit.type) {
                    case 'Branch':
                        delete $scope.currentPreset.applications[0].options.tag;
                        $scope.currentPreset.applications[0].options.branch = $scope.currentCommit.name;
                        break;
                    case 'Tag':
                        delete $scope.currentPreset.applications[0].options.branch;
                        $scope.currentPreset.applications[0].options.tag = $scope.currentCommit.name;
                        break;
                    default:
                        self.addFailureFlashMessage(
                            'Something is wrong with the type of the chosen commit. This should never happen. ' +
                            'In fact, If you see this message, please go ahaed and punch any of the involved developers in the face.',
                            false
                        );
                        $scope.currentCommit = null;
                        return;
                }
                $scope.currentPreset.applications[0].options.sha1 = $scope.currentCommit.commit.id;
            } catch (e) {
                self.addFailureFlashMessage(e.message, false);
                $scope.currentCommit = null;
            }
        };

        /**
         * @param {object} preset
         * @returns {string}
         */
        $scope.presetDisplay = function (preset) {
            if (angular.isUndefined($scope.currentPreset.applications)) {
                return '';
            }
            if ($scope.currentPreset === preset) {
                return '';
            }
            return 'disabled';
        };

        /**
         * @param {string} group
         * @return void
         */
        $scope.unsetLoadingKeyForGroup = function (group) {
            var key;
            for (key in $scope.deployableCommits) {
                if ($scope.deployableCommits.hasOwnProperty(key)) {
                    if (angular.isDefined($scope.deployableCommits[key].name) &&
                        angular.isDefined($scope.deployableCommits[key].group) &&
                        $scope.deployableCommits[key].name === loadingString  &&
                        $scope.deployableCommits[key].group === group) {
                            $scope.deployableCommits.splice(key, 1);
                            break;
                    }
                }
            }
        };

        /**
         * @param {string} name
         * @return {string}
         */
        $scope.getDeployedTag = function (name) {
            return UtilityService.getDeployedTag(name, $scope.tags);
        };

        $scope.$watch('project', function (project) {
            if (angular.isUndefined(project.repositoryUrl)) {
                return;
            }

            ProjectRepository.getFullProjectByRepositoryUrl(project.repositoryUrl).then(
                function (response) {
                    var property,
                        presets = response.repository.presets;
                    $scope.repositoryUrl = response.repository.webUrl;
                    response.repository.tags.sort(UtilityService.byCommitDate);
                    response.repository.branches.sort(UtilityService.byCommitDate);
                    $scope.tags = response.repository.tags;
                    $scope.deployableCommits = response.repository.tags;
                    jQuery.merge($scope.deployableCommits, response.repository.branches);

                    for (property in presets) {
                        if (presets.hasOwnProperty(property)) {
                            if (angular.isUndefined(presets[property].applications[0].type) || presets[property].applications[0].type === CONFIG.applicationTypes.deployTYPO3 || presets[property].applications[0].type === CONFIG.applicationTypes.deploy) {
                                $scope.servers.push(presets[property]);
                            }
                        }
                    }
                    $scope.finished = true;
                    if ($scope.servers.length === 0) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'No Servers yet!',
                            'FYI: There are no servers for project <span class="uppercase">' + $scope.name + '</span> yet. Why dont you create one, hmm?',
                            SEVERITY.info,
                            $scope.name + '-no-servers'
                        );
                    }
                },
                function () {
                    self.addFailureFlashMessage('API call failed. Deployment not possible.', true);
                }
            );

            PresetRepository.getGlobalServers('').then(
                function (response) {
                    $scope.globalServers = response.presets;
                },
                function () {
                    self.addFailureFlashMessage('API call failed. Deployment not possible.', true);
                }
            );

            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = [];
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
                    }
                }
            );
        });
    }
}());