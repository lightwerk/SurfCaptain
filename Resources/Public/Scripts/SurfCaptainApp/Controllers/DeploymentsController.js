/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('DeploymentsController', DeploymentsController);

    /* @ngInject */
    function DeploymentsController($scope, DeploymentRepository, toaster) {

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
                    toaster.pop(
                        'error',
                        'Error!',
                        'The API call failed. Please try again later.'
                    );
                }
            );
        };
        this.init();

        $scope.deployments = [];
        $scope.finished = false;
    }
}());