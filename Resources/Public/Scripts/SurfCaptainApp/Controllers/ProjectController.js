/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ProjectController', ProjectController);

    /* @ngInject */
    function ProjectController($scope, $controller, ProjectRepository, PresetService, SettingsRepository, UtilityService, $location) {

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        $scope.ordering = 'date';
        $scope.finished = false;
        $scope.tags = [];

        /**
         * @param {string} context
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

        /**
         * Sets the GET Parameter server and redirects to
         * the deploy view.
         *
         * @param {string} serverName
         * @return {void}
         */
        $scope.triggerDeployment = function (serverName) {
            $location.search('server', serverName);
            $location.path('project/' + $scope.name + '/deploy');
        };

        /**
         * Sets the GET Parameter server and redirects to
         * the sync view.
         *
         * @param {string} serverName
         * @return {void}
         */
        $scope.triggerSync = function (serverName) {
            $location.search('server', serverName);
            $location.path('project/' + $scope.name + '/sync');
        };

        $scope.$watch('project', function (project) {
            if (angular.isUndefined(project.repositoryUrl)) {
                return;
            }

            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = [];
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
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
                }
            );
        });
    }
}());