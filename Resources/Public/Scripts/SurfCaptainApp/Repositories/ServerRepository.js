/*jslint browser: true*/
'use strict'

surfCaptain.factory('ServerRepository', function ($http) {
    var serverRepository = {},
        projects = {},
        url = 'Scripts/SurfCaptainApp/ExampleData/serverCollections.json';

    /**
     * Gets all servers from the collection
     *
     * @returns {Promise} – promise object
     */
    serverRepository.getServers = function () {

    };

    /**
     * Gets all servers that belong to a given project
     *
     * @param {object} project
     * @returns {Promise} – promise object
     */
    serverRepository.getServersByProject = function (project) {

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
});