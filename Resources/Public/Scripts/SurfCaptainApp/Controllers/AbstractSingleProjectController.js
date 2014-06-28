/*jslint browser: true*/

'use strict';
surfCaptain.controller('AbstractSingleProjectController', ['$scope', '$routeParams', 'ProjectRepository', function ($scope, $routeParams, ProjectRepository) {
    $scope.name = $routeParams.itemName;
    $scope.project = {};

    this.init = function () {
        ProjectRepository.getProjectByName($scope.name, function (project) {
            $scope.project = project;
        });
    };
    this.init();
}]);