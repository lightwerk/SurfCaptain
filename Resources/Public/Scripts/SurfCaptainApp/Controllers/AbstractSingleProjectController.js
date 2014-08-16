/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.controller('AbstractSingleProjectController', ['$scope', '$routeParams', 'ProjectRepository', function ($scope, $routeParams, ProjectRepository) {
    $scope.name = $routeParams.projectName;
    $scope.project = {};

    this.init = function () {
        ProjectRepository.getProjects().then(function (projects) {
            $scope.project = ProjectRepository.getProjectByName($scope.name, projects);
        });
    };
    this.init();
}]);