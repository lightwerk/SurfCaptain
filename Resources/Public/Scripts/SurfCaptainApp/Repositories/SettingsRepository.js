/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('SettingsRepository', SettingsRepository);

    /* @ngInject */
    function SettingsRepository($http, $q, $cacheFactory) {
        var settingsRepository = {},
            url = '/api/frontendSetting';

        $cacheFactory('settingsCache');

        /**
         *
         * @returns {Q.promise|promise} – promise object
         */
        settingsRepository.getFrontendSettings = function () {
            var deferred = $q.defer(),
                settingsCache = $cacheFactory.get('settingsCache');
            if (angular.isDefined(settingsCache.get('configuration'))) {
                deferred.resolve(settingsCache.get('configuration'));
                return deferred.promise;
            }
            $http.get(url, {cache: true}).success(
                function (data) {
                    settingsCache.put('configuration', data.frontendSettings);
                    deferred.resolve(data.frontendSettings);
                }
            ).error(deferred.reject);
            return deferred.promise;
        };

        // Public API
        return {
            getSettings: function () {
                return settingsRepository.getFrontendSettings();
            }
        };
    }
}());