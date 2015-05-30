/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('SyncDeploymentRepository', SyncDeploymentRepository);

    /* @ngInject */
    function SyncDeploymentRepository($http, $q) {

        var deploymentRepository = {
                "create": addSync
            },
            url = '/api/syncDeployment',
            self = this;

        this.getRequestObject = getRequestObject;
        this.postRequest = postRequest;
        this.putRequest = putRequest;
        this.request = request;

        /**
         * @param {object} sync
         * @return {Q.promise|promise}
         */
        function addSync(sync) {
            return self.postRequest(sync);
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
            create: function (sync) {
                return deploymentRepository.create(sync);
            }
        };
    }
}());