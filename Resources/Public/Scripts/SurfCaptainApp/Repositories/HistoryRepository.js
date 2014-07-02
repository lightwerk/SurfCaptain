/*global surfCaptain*/
/*jslint node: true */

'use strict';

surfCaptain.factory('HistoryRepository', [ '$http', '$q', function ($http, $q) {
    var historyRepository = {},
        url = '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/ExampleData/history.json';

    /**
     *
     * @param project {string}
     * @returns {Promise} – promise object
     */
    historyRepository.getHistoryByProject = function (project) {
        var deferred = $q.defer();
        $http.get(url).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    return historyRepository;
}]);