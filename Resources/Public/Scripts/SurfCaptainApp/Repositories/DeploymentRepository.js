/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('DeploymentRepository', DeploymentRepository);

    /* @ngInject */
    function DeploymentRepository($http, $q, $cacheFactory) {

        var deploymentRepository = {
                "addDeployment": addDeployment,
                "getDeployments": getDeployments,
                "getSingleDeployment": getSingleDeployment,
                "cancelDeployment": cancelDeployment
            },
            url = '/api/deployment',
            self = this;

        this.getRequestObject = getRequestObject;
        this.postRequest = postRequest;
        this.putRequest = putRequest;
        this.request = request;

        $cacheFactory('deploymentCache');

        /**
         * @param {object} deployment
         * @return {Q.promise|promise}
         */
        function addDeployment(deployment) {
            return self.postRequest({deployment: {'configuration': deployment}});
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
            return self.putRequest({
                'deployment': {
                    '__identity': deploymentId,
                    'status': 'cancelled'
                }
            });
        }

        /**
         * @param {Object} data
         * @returns {promise|Q.promise}
         */
        function postRequest(data) {
            return self.request(self.getRequestObject('POST', data));
        }

        /**
         * @param {Object} data
         * @returns {promise|Q.promise}
         */
        function putRequest(data) {
            return self.request(self.getRequestObject('PUT', data));
        }

        /**
         * @param {Object} requestConfig
         * @returns {promise|Q.promise}
         */
        function request(requestConfig) {
            var deferred = $q.defer();
            $http(requestConfig).success(deferred.resolve).error(deferred.reject);
            return deferred.promise;
        }

        /**
         * @param {string} method
         * @param {Object} data
         * @returns {Object}
         */
        function getRequestObject(method, data) {
            return {
                'method': method,
                'url': url,
                'data': data,
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
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