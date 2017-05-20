/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('ExtensionRepository', ExtensionRepository);

    /* @ngInject */
    function ExtensionRepository($http, $q) {
        var extensionRepository = {},
            url = '/api/extension';

        /**
         *
         * @returns {Q.promise|promise} – promise object
         */
        extensionRepository.getExtensions = function () {
            var deferred = $q.defer();

            $http.get(url, {cache: true}).success(
                function (data) {
                    deferred.resolve(data);
                }
            ).error(deferred.reject);
            return deferred.promise;
        };

        // Public API
        return {
            getExtensions: function () {
                return extensionRepository.getExtensions();
            }
        };
    }
}());