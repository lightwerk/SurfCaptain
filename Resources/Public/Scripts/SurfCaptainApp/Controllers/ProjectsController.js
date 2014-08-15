/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ProjectsController', ['$scope', 'ProjectRepository', function ($scope, ProjectRepository) {
    $scope.ordering = 'name';
    $scope.projects = [];

    this.init = function () {
        // Retrieve Projects from Factory
        ProjectRepository.getProjects().then(
            function (response) {
                $scope.projects = response.repositories;
            },
            function () {
                //an error occurred
                $scope.message = 'API call failed. GitLab is currently not available.';
            }
        );
    };
    this.init();
}]);