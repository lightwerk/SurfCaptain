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
    'FlashMessageService',
    'SEVERITY',
    'ProjectRepository',
    function ($scope, DeploymentRepository, $routeParams, $cacheFactory, $location, $anchorScroll, FlashMessageService, SEVERITY, ProjectRepository) {

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
                ProjectRepository.updateFullProjectInCache($scope.deployment.repositoryUrl);
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
            if ($scope.logLength === 0) {
                $location.hash('bottom');
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

        $scope.deployConfigurationAgain = function () {
            DeploymentRepository.addDeployment($scope.deployment.configuration).then(
                function (response) {
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'OK!',
                        $scope.deployment.referenceName + ' will be shortly deployed onto '
                            + $scope.deployment.configuration.applications[0].nodes[0].name + '! You can cancel the deployment while it is still waiting.',
                        SEVERITY.ok
                    );
                    $location.path('deployments/' + response.deployment.__identity);
                },
                function () {
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Error!',
                        'Deployment configuration could not be submitted successfully. Try again later.',
                        SEVERITY.error
                    );
                }
            );
        };

        $scope.finished = false;
        $scope.noLog = false;
        $scope.logLength = 0;

    }
]);