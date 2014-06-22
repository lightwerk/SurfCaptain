/*jslint browser: true*/

'use strict';
surfCaptain.controller('DeployController', ['$scope', '$routeParams', 'ProjectRepository', function ($scope, $routeParams, ProjectRepository) {
    $scope.name = $routeParams.itemName;
    $scope.project = {};
    $scope.projects = {};

    this.init = function () {
        ProjectRepository.getProjects().then(function (response) {
            $scope.projects = response.projects;
            $scope.project = ProjectRepository.getProjectByName($scope.name);
        });
    };
    this.init();
}]);