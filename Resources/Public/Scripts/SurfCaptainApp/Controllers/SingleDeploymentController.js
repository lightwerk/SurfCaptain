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

        // properties of the vm
        $scope.finished = false;
        $scope.noLog = false;

        // methods published to the view
        $scope.cancelDeployment = cancelDeployment;
        $scope.deployConfigurationAgain = deployConfigurationAgain;

        // internal methods
        this.initLiveLog = initLiveLog;
        this.storeDeploymentInCacheFactory = storeDeploymentInCacheFactory;
        this.getDeployment = getDeployment;
        this.init = init;

        init();

        /**
         * Triggers the request for the Deployment object
         * after 1 second again if status of deployment
         * is either "waiting" or "running".
         *
         * @return {void}
         */
        function initLiveLog() {
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
                            ' was successfully deployed onto ' +
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
        }

        /**
         * @return {void}
         */
        function storeDeploymentInCacheFactory() {
            if (angular.isUndefined($cacheFactory.get('deploymentCache'))) {
                $cacheFactory('deploymentCache');
            }
            $cacheFactory.get('deploymentCache').put($scope.deployment.__identity, $scope.deployment);
            ProjectRepository.updateFullProjectInCache($scope.deployment.repositoryUrl);
        }

        /**
         * @return {void}
         */
        function getDeployment() {
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
        }

        /**
         * @return {void}
         */
         function init() {
            self.getDeployment();
        }

        /**
         * @return {void}
         */
        function cancelDeployment() {
            DeploymentRepository.cancelDeployment($routeParams.deploymentId).then(
                function () {
                    self.getDeployment();
                }
            );
        }

        /**
         * @return {void}
         */
        function deployConfigurationAgain() {
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
        }
    }
}());