/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';

surfCaptain.factory('ServerRepository', ['$http', '$q', function ($http, $q) {
    var serverRepository = {},
        url = '/api/presets';

    function ServerRepositoryException(message) {
        this.name = 'ServerRepositoryException';
        this.message = message;
    }
    ServerRepositoryException.prototype = new Error();
    ServerRepositoryException.prototype.constructor = ServerRepositoryException;

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
     * @throws {ServerRepositoryException}
     */
    serverRepository.getKeyFromServerConfiguration = function (server) {
        if (angular.isUndefined(server.nodes[0].name)) {
            if (angular.isUndefined(server.apllications[0].nodes[0].name)) {
                throw new ServerRepositoryException('ServerRepository.getKeyFromServerConfiguratio failed. Server configuration contains no key.');
            }
            return server.apllications[0].nodes[0].name;
        }
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
     * @param {object} preset
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.putServer = function (preset) {
        return this.sendSinglePresetToApi(preset, 'PUT');
    };

    /**
     * Adds a single server to the server collection
     *
     * @param preset {object}
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.postServer = function (preset) {
        return this.sendSinglePresetToApi(preset, 'POST');
    };


    /**
     * Performs a request to the api with a single preset.
     * This request can either be POST or PUT which can
     * be determined with the method argument. Any other
     * method will result in a failed API call.
     *
     * @param {object} preset
     * @param {string} method
     * @returns {promise|Q.promise}
     */
    serverRepository.sendSinglePresetToApi = function (preset, method) {
        var deferred = $q.defer(),
            configuration = this.getFullPresetAsString(preset);
        $http({
            method: method,
            url: url + '?key=' + this.getKeyFromServerConfiguration(preset) + '&configuration=' + configuration,
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