/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ProjectsController', ['$scope', 'ProjectRepository', 'SettingsRepository', function ($scope, ProjectRepository, SettingsRepository) {
    $scope.settings = {};
    $scope.ordering = 'name';
    $scope.projects = [];
    $scope.finished = false;

    this.init = function () {
        // Retrieve Projects from Factory
        ProjectRepository.getProjects().then(
            function (response) {
                $scope.finished = true;
                $scope.projects = response;
            },
            function () {
                //an error occurred
                $scope.finished = true;
                $scope.message = 'API call failed. GitLab is currently not available.';
            }
        );
        SettingsRepository.getSettings().then(
            function (response) {
                $scope.settings = response;
            }
        );
    };
    this.init();
}]);