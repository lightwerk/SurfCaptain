/*global surfCaptain*/
/*jslint node: true */

'use strict';

surfCaptain.factory('SettingsRepository', [ '$http', '$q', function ($http, $q) {
    var settingsRepository = {},
        url = '/api/frontendSetting';

    /**
     *
     * @returns {Q.promise|promise} – promise object
     */
    settingsRepository.getFrontendSettings = function () {
        var deferred = $q.defer();
        $http.get(url, {cache: true}).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    // Public API
    return {
        getSettings: function () {
            return settingsRepository.getFrontendSettings();
        }
    };
}]);