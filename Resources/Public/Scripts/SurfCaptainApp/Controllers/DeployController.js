/*global surfCaptain, angular, jQuery*/
/*jslint node: true */

'use strict';
surfCaptain.controller('DeployController', [
    '$scope',
    '$controller',
    'ProjectRepository',
    'HistoryRepository',
    'SEVERITY',
    'FlashMessageService',
    'CONFIG',
    'DeploymentRepository',
    '$location',
    '$cacheFactory',
    function ($scope, $controller, ProjectRepository, HistoryRepository, SEVERITY, FlashMessageService, CONFIG, DeploymentRepository, $location, $cacheFactory) {

        var loadingString = 'loading ...';

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

        /**
         *
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
                DeploymentRepository.addDeployment($scope.currentPreset).then(
                    function (response) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'OK!',
                            $scope.currentCommit.type + ' ' + $scope.currentCommit.name + ' will be shortly deployed onto '
                                + $scope.currentPreset.applications[0].nodes[0].name + '! You can cancel the deployment while it is still waiting.',
                            SEVERITY.ok
                        );
                        if (angular.isUndefined($cacheFactory.get('deploymentCache'))) {
                            $cacheFactory('deploymentCache');
                        }
                        $cacheFactory.get('deploymentCache').put(response.deployment.__identity, response.deployment);
                        $location.path('deployments/' + response.deployment.__identity);
                    },
                    function (response) {

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
        };

        /**
         * @param {object} preset
         * @returns {boolean}
         */
        $scope.presetDisplay = function (preset) {
            if (angular.isUndefined($scope.currentPreset.applications)) {
                return true;
            }
            return $scope.currentPreset === preset;
        };

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

        $scope.$watch('project', function (project) {
            var id;
            if (angular.isUndefined(project.repositoryUrl)) {
                return;
            }

            ProjectRepository.getFullProjectByRepositoryUrl(project.repositoryUrl).then(
                function (response) {
                    var property,
                        presets = response.repository.presets;
                    $scope.repositoryUrl = response.repository.webUrl;
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
                            SEVERITY.info
                        );
                    }
                },
                function () {
                    FlashMessageService.addFlashMessage(
                        'Error',
                        'API call failed. Deployment not possible.',
                        SEVERITY.error,
                        'deployment-project-call-failed'
                    );
                }
            );
        });
    }]);