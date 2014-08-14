/*jslint node: true, plusplus:true */
/*global surfCaptain, angular*/

// TODO uinittests

'use strict';
surfCaptain.controller('ServerController', ['$scope', '$controller', 'ServerRepository', 'ValidationService', function ($scope, $controller, ServerRepository, ValidationService) {

    var getAllServers, setTakenServerNamesAsUnavailableSuggestions, getNewPreset;

    /**
     * Returns the skeleton of a preset object
     *
     * @returns {object}
     */
    getNewPreset = function () {
        return {
            "options": {
                "repositoryUrl": '',
                "documentRoot": '',
                "context": ''
            },
            "nodes": [
                {
                    "name": '',
                    "hostname": '',
                    "username": ''
                }
            ]
        };
    };

    /**
     * Sets all serverNames that are already in use as
     * unavailable in the nameSuggestions array in the $scope
     *
     * @return {void}
     */
    setTakenServerNamesAsUnavailableSuggestions = function () {
        var i = 0, numberOfNameSuggestions, serverName, serverNames = [], property;

        for (property in $scope.servers) {
            if ($scope.servers.hasOwnProperty(property)) {
                serverNames.push(property);
            }
        }

        if (serverNames.length) {
            numberOfNameSuggestions = $scope.nameSuggestions.length;

            for (i; i < numberOfNameSuggestions; i++) {
                serverName = $scope.generateServerName($scope.nameSuggestions[i].suffix);
                $scope.nameSuggestions[i].available = !ValidationService.doesArrayContainsItem(serverNames, serverName);
            }
        }
    };

    /**
     * @return {void}
     */
    getAllServers = function () {
        $scope.newPreset.options.repositoryUrl = $scope.project.repository_url;
        ServerRepository.getServers($scope.project.repository_url).then(
            function (response) {
                $scope.servers = response.presets;
                // TODO remove Spinner
                setTakenServerNamesAsUnavailableSuggestions();
            },
            function (response) {
                // an error occurred
            }
        );
    };

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

    $scope.newPreset = getNewPreset();

    $scope.contexts = [
        'Production', 'Development', 'Staging'
    ];

    $scope.nameSuggestions = [
        {suffix: 'live', available: true},
        {suffix: 'qa', available: true},
        {suffix: 'staging', available: true},
        {suffix: 'test', available: true},
        {suffix: 'dev', available: true}
    ];

    $scope.deleteServer = function (server) {
        // TODO confirmation
        // TODO Spinner
        ServerRepository.deleteServer(server).then(
            function (response) {
                getAllServers();
            },
            function (response) {
                // an error occurred
            }
        );
    };

    $scope.updateServer = function (server) {
        ServerRepository.updateServer(server);
    };

    $scope.addServer = function (server) {
        ServerRepository.addServer(server).then(
            function (response) {
                // TODO Animation
                $scope.newPreset = getNewPreset();
                $scope.newServerForm.$setPristine();
                getAllServers();
            },
            function (response) {
                // an error occurred
            }
        );
    };

    /**
     * Validates the updated Host string before submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateHost = function (data) {
        return ValidationService.hasLength(data, 1, 'Host must not be empty!');
    };

    /**
     * Validates the updated DocumentRoot string before submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateDocumentRoot = function (data) {
        var res = ValidationService.hasLength(data, 1, 'DocumentRoot is required!');
        if (res === true) {
            return ValidationService.doesLastCharacterMatch(data, '/', 'DocumentRoot must end with "/"!');
        }
        return res;
    };

    /**
     * Validates the updated Username string before submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateUsername = function (data) {
        return ValidationService.hasLength(data, 1, 'User must not be empty!');
    };

    /**
     * Validates the updated Context string before submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateContext = function (data) {
        return ValidationService.doesArrayContainsItem($scope.contexts, data, 'Context is not valid!');
    };

    /**
     * Applies a server suffix to the current project name.
     *
     * @param {string} suffix
     * @returns {string}
     */
    $scope.generateServerName = function (suffix) {
        return $scope.project.identifier + '-' + suffix;
    };

    /**
     * Watches fpr the project property. If it gets filled,
     * further requests are triggered.
     *
     * @return {void}
     */
    $scope.$watch('project', function (newValue, oldValue) {
        if (newValue.name === undefined) {
            return;
        }
        getAllServers();
    });

}]);