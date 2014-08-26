/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('SingleDeploymentController', ['$scope', 'DeploymentRepository', '$routeParams', function ($scope, DeploymentRepository, $routeParams) {

    var self = this;

    /**
     * @return {void}
     */
    this.initLiveLog = function () {
        if ($scope.noLog) {
            return;
        }
        switch ($scope.deployment.status) {
        case 'success':
        case 'failed':
            return;
        case 'waiting':
        case 'running':
            setTimeout(self.getDeployment, 2000);
            break;
        default:
            return;
        }
    };

    /**
     * @return {void}
     */
    this.getDeployment = function () {
        DeploymentRepository.getSingleDeployment($routeParams.deploymentId).then(
            function (response) {
                $scope.finished = true;
                $scope.deployment = response.deployment;
                self.initLiveLog();
            },
            function () {
                $scope.finished = true;
                $scope.noLog = true;
            }
        );
    };

    /**
     * @return {void}
     */
    this.init = function () {
        this.getDeployment();
    };

    this.init();

    $scope.cancelDeployment = function () {
        console.log('ugh');
        DeploymentRepository.cancelDeployment($routeParams.deploymentId).then(
            function () {
                self.getDeployment();
            }
        );
    };

    $scope.finished = false;
    $scope.noLog = false;

}]);