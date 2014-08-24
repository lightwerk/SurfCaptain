/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';

surfCaptain.factory('PresetRepository', ['$http', '$q', function ($http, $q) {
    var presetRepository = {},
        url = '/api/preset';

    function PresetRepositoryException(message) {
        this.name = 'PresetRepositoryException';
        this.message = message;
    }
    PresetRepositoryException.prototype = new Error();
    PresetRepositoryException.prototype.constructor = PresetRepositoryException;

    /**
     * Gets all servers from the collection
     *
     * @param {object} server
     * @returns {string} – json string
     */
    presetRepository.getFullPresetAsString = function (server) {
        return angular.toJson(presetRepository.getFullPreset(server), false);
    };

    /**
     * Gets all servers from the collection
     *
     * @param {object} server
     * @returns {object}
     */
    presetRepository.getFullPreset = function (server) {
        var container = {"applications": []};
        container.applications[0] = server;
        return container;
    };

    /**
     *
     * @param {object} server
     * @returns {string}
     * @throws {PresetRepositoryException}
     */
    presetRepository.getKeyFromServerConfiguration = function (server) {
        if (angular.isUndefined(server.nodes[0].name)) {
            if (angular.isUndefined(server.applications[0].nodes[0].name)) {
                throw new PresetRepositoryException('PresetRepository.getKeyFromServerConfiguration failed. Server configuration contains no key.');
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
    presetRepository.getApplicationContainer = function (server) {
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
    presetRepository.getServers = function (repositoryUrl) {
        var deferred = $q.defer();
        $http.get('/api/repository?repositoryUrl=' + repositoryUrl).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Gets all servers from the collection
     *
     * @returns {Q.promise|promise} – promise object
     */
    presetRepository.getGlobalServers = function () {
        var deferred = $q.defer();
        $http.get(url + '?globals=1').success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Adds a single server to the server collection
     *
     * @param {object} preset
     * @returns {Q.promise|promise} – promise object
     */
    presetRepository.putServer = function (preset) {
        return this.sendSinglePresetToApi(preset, 'put');
    };

    /**
     * Adds a single server to the server collection
     *
     * @param preset {object}
     * @returns {Q.promise|promise} – promise object
     */
    presetRepository.postServer = function (preset) {
        return this.sendSinglePresetToApi(preset, 'post');
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
    presetRepository.sendSinglePresetToApi = function (preset, method) {
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: {
                'key': this.getKeyFromServerConfiguration(preset),
                'configuration': presetRepository.getFullPreset(preset)
            },
            headers: {
                'Accept': 'application/json'
            }
        }).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Removes a single server from the server collection
     *
     * @param server {object}
     * @returns {Q.promise|promise} – promise object
     */
    presetRepository.deleteServer = function (server) {
        var deferred = $q.defer();
        $http.delete(url + '?key=' + presetRepository.getKeyFromServerConfiguration(server.applications[0]))
            .success(deferred.resolve)
            .error(deferred.reject);
        return deferred.promise;
    };

    // Public API
    return {
        getServers: function (repositoryUrl) {
            return presetRepository.getServers(repositoryUrl);
        },
        getGlobalServers: function () {
            return presetRepository.getGlobalServers();
        },
        updateServer: function (server) {
            return presetRepository.putServer(server);
        },
        addServer: function (server) {
            return presetRepository.postServer(server);
        },
        deleteServer: function (server) {
            return presetRepository.deleteServer(server);
        }
    };
}]);