/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('PresetRepository', PresetRepository);

    /* @ngInject */
    function PresetRepository($http, $q, RequestService) {
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
            var container = {'applications': []};
            container.applications[0] = server;
            return container;
        };

        /**
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
         * @param {object} server
         * @return {object}
         */
        presetRepository.getApplicationContainer = function (server) {
            var applicationContainer = {'applications': []};
            applicationContainer.applications[0] = server;
            return applicationContainer;
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
            var data = {
                'key': this.getKeyFromServerConfiguration(preset),
                'configuration': presetRepository.getFullPreset(preset)
            };
            return RequestService.putRequest(data, url);
        };

        /**
         * Adds a single server to the server collection
         *
         * @param preset {object}
         * @returns {Q.promise|promise} – promise object
         */
        presetRepository.postServer = function (preset) {
            var data = {
                'key': this.getKeyFromServerConfiguration(preset),
                'configuration': presetRepository.getFullPreset(preset)
            };
            return RequestService.postRequest(data, url);
        };

        /**
         * Removes a single server from the server collection
         *
         * @param server {object}
         * @returns {Q.promise|promise} – promise object
         */
        presetRepository.deleteServer = function (server) {
            var deferred = $q.defer();
            $http.delete(url + '?key=' + presetRepository
                .getKeyFromServerConfiguration(server.applications[0]))
                .success(deferred.resolve)
                .error(deferred.reject);
            return deferred.promise;
        };

        // Public API
        return {
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
    }
}());