/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').controller('AbstractSingleProjectController', [
    '$scope',
    '$routeParams',
    'ProjectRepository',
    'FavorService',
    function ($scope, $routeParams, ProjectRepository, FavorService) {
        $scope.name = $routeParams.projectName;
        $scope.project = {};
        $scope.messages = {};

        this.init = function () {
            ProjectRepository.getProjects().then(function (projects) {
                $scope.project = ProjectRepository.getProjectByName($scope.name, projects);
                FavorService.addFavoriteProject($scope.project);
            });
        };
        this.init();
    }
]);