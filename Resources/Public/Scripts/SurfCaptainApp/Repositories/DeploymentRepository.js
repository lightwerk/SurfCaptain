/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('DeploymentRepository', DeploymentRepository);

    /* @ngInject */
    function DeploymentRepository($http, $q, $cacheFactory, RequestService) {

        var deploymentRepository = {
                'addDeployment': addDeployment,
                'getDeployments': getDeployments,
                'getSingleDeployment': getSingleDeployment,
                'cancelDeployment': cancelDeployment
            },
            url = '/api/deployment';

        $cacheFactory('deploymentCache');

        /**
         * @param {object} deployment
         * @return {Q.promise|promise}
         */
        function addDeployment(deployment) {
            return RequestService.postRequest({deployment: {'configuration': deployment}}, url);
        }

        /**
         * @return {promise|Q.promise}
         */
        function getDeployments() {
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);
            return deferred.promise;
        }

        /**
         * @param {string} identifier
         * @return {promise|Q.promise}
         */
        function getSingleDeployment(identifier) {
            var deferred = $q.defer();
            if (angular.isDefined($cacheFactory.get('deploymentCache').get(identifier))) {
                deferred.resolve({deployment: $cacheFactory.get('deploymentCache').get(identifier)});
                return deferred.promise;
            }
            $http.get(url + '?deployment=' + identifier).success(deferred.resolve).error(deferred.reject);
            return deferred.promise;
        }

        /**
         * @param {string} deploymentId
         * @return {promise|Q.promise}
         */
        function cancelDeployment(deploymentId) {
            return RequestService.putRequest({
                'deployment': {
                    '__identity': deploymentId,
                    'status': 'cancelled'
                }
            }, url);
        }

        // Public API
        return {
            addDeployment: function (deployment) {
                return deploymentRepository.addDeployment(deployment);
            },
            cancelDeployment: function (deploymentId) {
                return deploymentRepository.cancelDeployment(deploymentId);
            },
            getAllDeployments: function () {
                return deploymentRepository.getDeployments();
            },
            getSingleDeployment: function (identifier) {
                return deploymentRepository.getSingleDeployment(identifier);
            }
        };
    }
}());