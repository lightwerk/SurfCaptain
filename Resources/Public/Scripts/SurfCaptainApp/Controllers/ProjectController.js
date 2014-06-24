/*jslint browser: true*/

'use strict';
surfCaptain.controller('ProjectController', ['$scope', '$routeParams', 'ProjectRepository', 'HistoryRepository', function ($scope, $routeParams, ProjectRepository, HistoryRepository) {
    $scope.name = $routeParams.itemName;
    $scope.ordering = 'date';
    $scope.constraint = '';
    $scope.project = {};

    this.init = function () {
        ProjectRepository.getProjects().then(function (response) {
            $scope.projects = response.projects;
            $scope.project = ProjectRepository.getProjectByName(response.projects, $scope.name);
            HistoryRepository.getHistoryByProject($scope.project).then(function (response) {
                $scope.history = response;
            });
        });
    };
   this.init();
}]);