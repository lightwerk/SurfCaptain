/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('DeploymentsController', DeploymentsController);

    /* @ngInject */
    function DeploymentsController($scope, DeploymentRepository, FlashMessageService) {

        var self = this;

        $scope.deployments = [];
        $scope.finished = false;

        this.init = init;
        this.setDeployments = setDeployments;
        init();

        /**
         * @return {void}
         */
        function init() {
            DeploymentRepository.getAllDeployments().then(
                function (response) {
                    $scope.finished = true;
                    self.setDeployments(response.deployments);
                },
                function (response) {
                    $scope.finished = true;
                    FlashMessageService.addErrorFlashMessageFromResponse(
                        response,
                        'Error!',
                        'The API call failed. Please try again later.'
                    );
                }
            );
        }

        /**
         * @param deployments
         * @return {void}
         */
        function setDeployments(deployments) {
            $scope.deployments = deployments;
        }

    }
}());