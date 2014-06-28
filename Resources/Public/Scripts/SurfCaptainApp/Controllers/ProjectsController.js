/*global surfCaptain*/

'use strict';
surfCaptain.controller('ProjectsController', ['$scope', 'ProjectRepository', function ($scope, ProjectRepository) {
    $scope.ordering = 'name';
    $scope.projects = [];

    this.init = function () {
        // Retrieve Projects from Factory
        ProjectRepository.getProjects().then(
            function (response) {
                $scope.projects = response.projects;
            },
            function () {
                //an error occured
            }
        );
    };
    this.init();
}]);