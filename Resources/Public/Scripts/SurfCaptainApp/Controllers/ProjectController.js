/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').controller('ProjectController', [
    '$scope',
    '$controller',
    'FlashMessageService',
    'ProjectRepository',
    'SEVERITY',
    'PresetService',
    'SettingsRepository',
    'UtilityService',
    function ($scope, $controller, FlashMessageService, ProjectRepository, SEVERITY, PresetService, SettingsRepository, UtilityService) {

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        $scope.ordering = 'date';
        $scope.finished = false;
        $scope.tags = [];

        /**
         *  @param {string} context
         * @returns {string}
         */
        $scope.getRootContext = function (context) {
            return PresetService.getRootContext(context, $scope.contexts);
        };

        /**
         *
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
                    $scope.finished = true;
                    $scope.deployments = response.repository.deployments;
                    $scope.presets = response.repository.presets;
                    $scope.tags = response.repository.tags;
                },
                function () {
                    $scope.finished = true;
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
]);