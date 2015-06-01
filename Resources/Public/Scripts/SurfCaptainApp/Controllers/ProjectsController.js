/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ProjectsController', ProjectsController);

    /* @ngInject */
    function ProjectsController($scope, ProjectRepository, SettingsRepository, FlashMessageService) {

        // properties of the vm
        $scope.settings = {};
        $scope.ordering = 'name';
        $scope.projects = [];
        $scope.finished = false;

        this.init = init;

        init();

        function init() {
            ProjectRepository.getProjects().then(
                function (response) {
                    $scope.finished = true;
                    $scope.projects = response;
                },
                function (response) {
                    //an error occurred
                    $scope.finished = true;
                    FlashMessageService.addErrorFlashMessageFromResponse(
                       response,
                        'Error!',
                        'API call failed. Your connected Git repository is currently not available.'
                    );
                }
            );
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.settings = response;
                }
            );
        }
    }
}());