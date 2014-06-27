/*jslint browser: true*/

'use strict';
surfCaptain.controller('ProjectController', ['$scope', '$routeParams', 'ProjectRepository', 'HistoryRepository', function ($scope, $routeParams, ProjectRepository, HistoryRepository) {
    $scope.name = $routeParams.itemName;
    $scope.ordering = 'date';
    $scope.constraint = '';
    $scope.project = {};

    this.init = function () {
        ProjectRepository.getProjectByName($scope.name, function (project) {
            $scope.project = project;
        });
    };
    this.init();

    $scope.$watch('project', function (newValue, oldValue) {
        if (newValue.name === undefined) {
            return;
        }

        HistoryRepository.getHistoryByProject($scope.project).then(function (response) {
            $scope.history = response;
        });
    });
}]);