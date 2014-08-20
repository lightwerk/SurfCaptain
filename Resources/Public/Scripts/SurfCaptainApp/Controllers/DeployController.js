/*global surfCaptain, angular, jQuery*/
/*jslint node: true */

'use strict';
surfCaptain.controller('DeployController', [
    '$scope',
    '$controller',
    'ProjectRepository',
    'HistoryRepository',
    function ($scope, $controller, ProjectRepository, HistoryRepository) {

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
        $scope.currentPreset = {};

        /**
         *
         * @param {object} preset
         * @return {void}
         */
        $scope.setCurrentPreset = function (preset) {
            $scope.currentPreset = preset;
        };

        $scope.presetDisplay = function (preset) {
            if (angular.isUndefined($scope.currentPreset.applications)) {
                return true;
            }
            if ($scope.currentPreset === preset) {
                return true;
            }
            return false;
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
                        presets = response.repository.presets,
                        branchesAmount,
                        i = 0;
                    console.log(response);
                    $scope.deployableCommits = response.repository.tags;
                    branchesAmount = response.repository.branches.length;
                    for (i; i < branchesAmount; i++) {
                        $scope.deployableCommits.push(response.repository.branches[i]);
                    }


                    for (property in presets) {
                        if (presets.hasOwnProperty(property)) {
                            $scope.servers.push(presets[property]);
                        }
                    }
                    console.log($scope.servers);
                }
            );

            HistoryRepository.getHistoryByProject($scope.project).then(function (response) {
                $scope.history = response.filter(function (entry) {
                    return entry.application === 'Deploy';
                });
            });
        });
    }]);