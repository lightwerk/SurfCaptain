/*jslint browser: true*/
'use strict'

surfCaptain.factory('ServerRepository', ['$http', '$q', function ($http, $q) {
    var serverRepository = {},
        url = 'Scripts/SurfCaptainApp/ExampleData/servers.json';

    /**
     * Gets all servers from the collection
     *
     * @returns {Promise} – promise object
     */
    serverRepository.getServers = function () {
        var deferred = $q.defer();
        $http.get(url).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Adds a single server to the server collection
     *
     * @param server {object}
     * @returns {Promise} – promise object
     */
    serverRepository.putServer = function (server) {

    };

    /**
     * Removes a single server from the server collection
     *
     * @param server {object}
     * @returns {Promise} – promise object
     */
    serverRepository.deleteServer = function (server) {

    };

    return serverRepository;
}]);