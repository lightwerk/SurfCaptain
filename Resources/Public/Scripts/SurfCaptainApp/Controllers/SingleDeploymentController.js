/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('SingleDeploymentController', SingleDeploymentController);

    /* @ngInject */
    function SingleDeploymentController($scope, DeploymentRepository, $routeParams, $cacheFactory, $location, toaster, ProjectRepository, $controller) {

        var self = this,
            flashMessageShown = false,
            wasRunning = false;

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        /**
         * Triggers the request for the Deployment object
         * after 1 second again if status of deployment
         * is either "waiting" or "running".
         *
         * @return {void}
         */
        this.initLiveLog = function () {
            if ($scope.noLog) {
                return;
            }
            switch ($scope.deployment.status) {
                case 'success':
                    if (wasRunning && !flashMessageShown) {
                        toaster.pop(
                            'success',
                            'Deployment Successfull!',
                            $scope.deployment.referenceName +
                            'was successfully deployed onto ' +
                            $scope.deployment.options.name + '!'
                        );
                        flashMessageShown = true;
                    }
                    self.storeDeploymentInCacheFactory();
                    break;
                case 'failed':
                    if (wasRunning && !flashMessageShown) {
                        toaster.pop(
                            'error',
                            'Deployment Failed!',
                            $scope.deployment.referenceName +
                            'could not be deployed onto ' +
                            $scope.deployment.options.name + '! Check the log for what went wrong.'
                        );
                        flashMessageShown = true;
                    }
                    self.storeDeploymentInCacheFactory();
                    break;
                case 'cancelled':
                    self.storeDeploymentInCacheFactory();
                    return;
                case 'waiting':
                    if (!flashMessageShown) {
                        toaster.pop(
                            'note',
                            'Deployment will start shortly!',
                            $scope.deployment.referenceName + ' will be shortly deployed onto ' +
                            $scope.deployment.options.name + '! You can cancel the deployment while it is still waiting.'
                        );
                        flashMessageShown = true;
                    }
                    setTimeout(self.getDeployment, 1000);
                    break;
                case 'running':
                    flashMessageShown = false;
                    wasRunning = true;
                    setTimeout(self.getDeployment, 1000);
                    break;
                default:
                    return;
            }
        };

        /**
         * @return {void}
         */
        this.storeDeploymentInCacheFactory = function () {
            if (angular.isUndefined($cacheFactory.get('deploymentCache'))) {
                $cacheFactory('deploymentCache');
            }
            $cacheFactory.get('deploymentCache').put($scope.deployment.__identity, $scope.deployment);
            ProjectRepository.updateFullProjectInCache($scope.deployment.repositoryUrl);
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

        /**
         * @return {void}
         */
        $scope.cancelDeployment = function () {
            DeploymentRepository.cancelDeployment($routeParams.deploymentId).then(
                function () {
                    self.getDeployment();
                }
            );
        };

        /**
         * @return {void}
         */
        $scope.deployConfigurationAgain = function () {
            DeploymentRepository.addDeployment($scope.deployment.configuration).then(
                function (response) {
                    $location.path('project/' + $scope.name + '/deployment/' + response.deployment.__identity);
                },
                function () {
                    toaster.pop(
                        'error',
                        'Error!',
                        'Deployment configuration could not be submitted successfully. Try again later.'
                    );
                }
            );
        };

        $scope.finished = false;
        $scope.noLog = false;

    }
}());