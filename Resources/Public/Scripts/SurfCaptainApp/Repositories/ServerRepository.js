/*global surfCaptain*/
/*jslint node: true */

'use strict';

surfCaptain.factory('ServerRepository', ['$http', '$q', function ($http, $q) {
    var serverRepository = {},
        url = '/api/presets';

    /**
     * Gets all servers from the collection
     *
     * @param {object} server
     * @returns {string} – json string
     */
    serverRepository.getFullPresetAsString = function (server) {
        var container = {"applications": []};
        container.applications[0] = server;
        return JSON.stringify(container);
    };

    /**
     *
     * @param {object} server
     * @returns {string}
     */
    serverRepository.getKeyFromServerConfiguration = function (server) {
        return server.nodes[0].name;
    };

    /**
     *
     * @param {object} server
     * @return {object}
     */
    serverRepository.getApplicationContainer = function (server) {
        var applicationContainer = {"applications": []};
        applicationContainer.applications[0] = server;
        return applicationContainer;
    };

    /**
     * Gets all servers from the collection
     *
     * @param {string} repositoryUrl
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.getServers = function (repositoryUrl) {
        var deferred = $q.defer();
        $http.get(url + '?repositoryUrl=' + repositoryUrl).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Adds a single server to the server collection
     *
     * @param {string} repositoryUrl
     * @param server {object}
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.putServer = function (server) {
        console.log(server);
    };

    /**
     * Adds a single server to the server collection
     *
     * @param server {object}
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.postServer = function (server) {
        var deferred = $q.defer(),
            configuration = this.getFullPresetAsString(server);
        $http({
            method: 'POST',
            url: url + '?key=' + this.getKeyFromServerConfiguration(server) + '&configuration=' + configuration,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Removes a single server from the server collection
     *
     * @param server {object}
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.deleteServer = function (server) {
        var deferred = $q.defer();
        $http.delete(url + '?key=' + serverRepository.getKeyFromServerConfiguration(server.applications[0]))
            .success(deferred.resolve)
            .error(deferred.reject);
        return deferred.promise;
    };

    // Public API
    return {
        getServers: function (repositoryUrl) {
            return serverRepository.getServers(repositoryUrl);
        },
        updateServer: function (server) {
            return serverRepository.putServer(server);
        },
        addServer: function (server) {
            return serverRepository.postServer(server);
        },
        deleteServer: function (server) {
            return serverRepository.deleteServer(server);
        }
    };
}]);