/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('AbstractSingleProjectController', AbstractSingleProjectController);

    /* @ngInject */
    function AbstractSingleProjectController($scope, $routeParams, ProjectRepository, FavorService, toaster) {
        $scope.name = $routeParams.projectName;
        $scope.project = {};
        $scope.messages = {};
        $scope.error = false;

        this.init = function () {
            ProjectRepository.getProjects().then(
                function (projects) {
                    $scope.project = ProjectRepository.getProjectByName($scope.name, projects);
                    FavorService.addFavoriteProject($scope.project);
                },
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Error!',
                        'API call failed. Please try again later.'
                    );
                    $scope.error = true;
                }
            );
        };
        this.init();
    }
}());