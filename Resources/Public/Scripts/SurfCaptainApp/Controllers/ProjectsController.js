/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').controller('ProjectsController', [
    '$scope',
    'ProjectRepository',
    'SettingsRepository',
    'SEVERITY',
    'FlashMessageService',
    'FavorService',
    function ($scope, ProjectRepository, SettingsRepository, SEVERITY, FlashMessageService, FavorService) {
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
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Error!',
                        'API call failed. GitLab is currently not available.',
                        SEVERITY.error,
                        'projects-loaded-error'
                    );
                }
            );
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.settings = response;
                }
            );
        };
        this.init();
    }
]);