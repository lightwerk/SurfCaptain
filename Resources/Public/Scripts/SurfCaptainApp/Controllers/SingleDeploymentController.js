/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('SingleDeploymentController', ['$scope', 'DeploymentRepository', '$routeParams', function ($scope, DeploymentRepository, $routeParams) {

    this.init = function () {
        DeploymentRepository.getSingleDeployment($routeParams.deploymentId).then(
            function (response) {
                $scope.finished = true;
                $scope.deployment = response.deployment;
            },
            function () {

            }
        );
    };

    this.init();

    $scope.finished = false;

}]);