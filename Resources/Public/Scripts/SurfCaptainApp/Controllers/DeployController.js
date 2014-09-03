/*global surfCaptain, angular, jQuery*/
/*jslint node: true, plusplus:true */

'use strict';
angular.module('surfCaptain').controller('DeployController', [
    '$scope',
    '$controller',
    'ProjectRepository',
    'SEVERITY',
    'FlashMessageService',
    'CONFIG',
    'DeploymentRepository',
    '$location',
    'PresetRepository',
    'ValidationService',
    'SettingsRepository',
    'PresetService',
    'UtilityService',
    function ($scope, $controller, ProjectRepository, SEVERITY, FlashMessageService, CONFIG, DeploymentRepository, $location, PresetRepository, ValidationService, SettingsRepository, PresetService, UtilityService) {

        var loadingString = 'loading ...',
            self = this;

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

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
         * @return {void}
         */
        this.addFailureFlashMessage = function () {
            $scope.finished = true;
            $scope.messages = FlashMessageService.addFlashMessage(
                'Request failed!',
                'API call failed. Deployment not possible.',
                SEVERITY.error,
                'deployment-project-call-failed'
            );
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
                $scope.currentPreset.applications[0].type = CONFIG.applicationTypes.deployTYPO3;
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
                            $scope.currentCommit.type + ' ' + $scope.currentCommit.name + ' will be shortly deployed onto '
                                + $scope.currentPreset.applications[0].nodes[0].name + '! You can cancel the deployment while it is still waiting.',
                            SEVERITY.ok
                        );
                        ProjectRepository.updateFullProjectInCache($scope.project.repositoryUrl);
                        $location.path('deployments/' + response.deployment.__identity);
                    },
                    function (response) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'Error!',
                            'Deployment configuration could not be submitted successfully. Try again later.',
                            SEVERITY.error
                        );
                    }
                );
            }
        };

        /**
         * @return {void}
         */
        $scope.setCommitInCurrentPreset = function () {
            var commit = $scope.deployableCommits.filter(function (commit) {
                return commit.identifier === $scope.selectedCommit;
            }), date;
            if (angular.isUndefined(commit[0]) || commit === null || commit.length > 1) {
                FlashMessageService.addFlashMessage(
                    'Error',
                    'Something went wrong with the chosen Commit',
                    SEVERITY.error
                );
                $scope.error = true;
                return;
            }
            $scope.currentCommit = commit[0];
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
                FlashMessageService.addFlashMessage(
                    'Error',
                    'Something went wrong with the chosen Commit',
                    SEVERITY.error
                );
                $scope.error = true;
                $scope.currentCommit = null;
                return;
            }
            $scope.currentPreset.applications[0].options.sha1 = $scope.currentCommit.commit.id;
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
                    if (angular.isDefined($scope.deployableCommits[key].name)
                            && angular.isDefined($scope.deployableCommits[key].group)
                            && $scope.deployableCommits[key].name === loadingString
                            && $scope.deployableCommits[key].group === group) {
                        $scope.deployableCommits.splice(key, 1);
                        break;
                    }
                }
            }
        };

        /**
         * @param {string} context
         * @returns {string}
         */
        $scope.getRootContext = function (context) {
            return PresetService.getRootContext(context, $scope.contexts);
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
                    console.log(response.repository.tags);
                    response.repository.tags.sort(UtilityService.byCommitDate);
                    response.repository.branches.sort(UtilityService.byCommitDate);
                    $scope.tags = response.repository.tags;
                    $scope.deployableCommits = response.repository.tags;
                    jQuery.merge($scope.deployableCommits, response.repository.branches);

                    for (property in presets) {
                        if (presets.hasOwnProperty(property)) {
                            if (angular.isUndefined(presets[property].applications[0].type) || presets[property].applications[0].type === CONFIG.applicationTypes.deployTYPO3) {
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

            PresetRepository.getGlobalServers('').then(
                function (response) {
                    $scope.globalServers = response.presets;
                },
                function (response) {
                    self.addFailureFlashMessage();
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
    }]);