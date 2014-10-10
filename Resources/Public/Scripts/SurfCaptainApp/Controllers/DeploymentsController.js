/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('DeploymentsController', DeploymentsController);

    /* @ngInject */
    function DeploymentsController($scope, DeploymentRepository, FlashMessageService, SEVERITY) {

        var self = this;

        /**
         * @param deployments
         * @return {void}
         */
        this.setDeployments = function (deployments) {
            $scope.deployments = deployments;
        };

        /**
         * @return {void}
         */
        this.init = function () {
            DeploymentRepository.getAllDeployments().then(
                function (response) {
                    $scope.finished = true;
                    self.setDeployments(response.deployments);
                },
                function () {
                    $scope.finished = true;
                    FlashMessageService.addFlashMessage(
                        'Error!',
                        'The API call failed. Please try again later.',
                        SEVERITY.error,
                        'deployment-list-no-response'
                    );
                }
            );
        };
        this.init();

        $scope.deployments = [];
        $scope.finished = false;
    }
}());