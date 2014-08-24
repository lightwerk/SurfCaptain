/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ProjectsController', [
    '$scope',
    'ProjectRepository',
    'SettingsRepository',
    'SEVERITY',
    'FlashMessageService',
    function ($scope, ProjectRepository, SettingsRepository, SEVERITY, FlashMessageService) {
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
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'At your Service!',
                        'All Projects have been loaded successfully. Have fun!',
                        SEVERITY.ok,
                        'projects-loaded-ok'
                    );
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