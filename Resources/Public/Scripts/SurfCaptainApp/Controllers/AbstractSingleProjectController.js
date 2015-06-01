/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('AbstractSingleProjectController', AbstractSingleProjectController);

    /* @ngInject */
    function AbstractSingleProjectController($scope, $routeParams, ProjectRepository, FavorService, FlashMessageService) {
        $scope.name = $routeParams.projectName;
        $scope.project = {};
        $scope.messages = {};
        $scope.error = false;

        this.init = function () {
            ProjectRepository.getProjects().then(
                function (projects) {
                    $scope.project = ProjectRepository.getProjectByName($scope.name, projects);
                    FavorService.addFavoriteProject($scope.project);
                },
                function (response) {
                    $scope.finished = true;
                    FlashMessageService.addErrorFlashMessageFromResponse(
                        response,
                        'Error!',
                        'API call failed. Please try again later.'
                    );
                    $scope.error = true;
                }
            );
        };
        this.init();
    }
}());