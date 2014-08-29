/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').controller('SingleDeploymentController', [
    '$scope',
    'DeploymentRepository',
    '$routeParams',
    '$cacheFactory',
    '$location',
    '$anchorScroll',
    function ($scope, DeploymentRepository, $routeParams, $cacheFactory, $location, $anchorScroll) {

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
            case 'cancelled':
                if (angular.isUndefined($cacheFactory.get('deploymentCache'))) {
                    $cacheFactory('deploymentCache');
                }
                $cacheFactory.get('deploymentCache').put($scope.deployment.__identity, $scope.deployment);
                return;
            case 'waiting':
            case 'running':
                setTimeout(self.getDeployment, 1000);
                break;
            default:
                return;
            }
        };

        /**
         * @return {void}
         */
        this.getDeployment = function () {
            self.scrollToNewLogEntries();
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
         * @return void
         */
        this.scrollToNewLogEntries = function () {
            if (angular.isUndefined($scope.deployment)) {
                return;
            }
            if ($scope.deployment.logs.length > $scope.logLength) {
                $anchorScroll();
                $scope.logLength = $scope.deployment.logs.length;
            }
        };

        /**
         * @return {void}
         */
        this.init = function () {
            $location.hash('bottom');
            this.getDeployment();
        };

        this.init();

        $scope.cancelDeployment = function () {
            DeploymentRepository.cancelDeployment($routeParams.deploymentId).then(
                function () {
                    self.getDeployment();
                }
            );
        };

        $scope.finished = false;
        $scope.noLog = false;
        $scope.logLength = 0;

    }
]);