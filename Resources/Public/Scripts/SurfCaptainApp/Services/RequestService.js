/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('RequestService', RequestService);

    /* @ngInject */
    function RequestService($http, $q) {

        var self = this;

        this.postRequest = postRequest;
        this.putRequest = putRequest;
        this.request = request;
        this.getRequestObject = getRequestObject;

        /**
         * @param {Object} data
         * @param {string} url
         * @returns {promise|Q.promise}
         */
        function postRequest(data, url) {
            return self.request(self.getRequestObject('POST', data, url));
        }

        /**
         * @param {Object} data
         * @param {string} url
         * @returns {promise|Q.promise}
         */
        function putRequest(data, url) {
            return self.request(self.getRequestObject('PUT', data, url));
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
         * @param {string} url
         * @returns {Object}
         */
        function getRequestObject(method, data, url) {
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
    }
}());