/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.controller('AbstractSingleProjectController', ['$scope', '$routeParams', 'ProjectRepository', function ($scope, $routeParams, ProjectRepository) {
    $scope.name = $routeParams.itemName;
    $scope.project = {};

    this.init = function () {
        ProjectRepository.getProjects().then(function (projects) {
            $scope.project = ProjectRepository.getProjectByName(projects.projects, $scope.name);
        });
    };
    this.init();
}]);