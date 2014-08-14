/*global surfCaptain, angular*/
/*jslint node: true, plusplus:true */

'use strict';
surfCaptain.controller('ServerController', ['$scope', '$controller', 'ServerRepository', 'ValidationService', function ($scope, $controller, ServerRepository, ValidationService) {

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

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
        ServerRepository.deleteServer(server);
    };

    $scope.updateServer = function (server) {
        ServerRepository.putServer(server);
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
        return $scope.name + '-' + suffix;
    };

    $scope.$watch('project', function (newValue, oldValue) {
        var elements,
            i = 0,
            numberOfNameSuggestions = $scope.nameSuggestions.length,
            serverName;
        if (newValue.name === undefined) {
            return;
        }
        ServerRepository.getServers().then(function (response) {
            $scope.servers = response.filter(function (entry) {
                return entry.project === newValue.id;
            });
            $scope.serverNames = ['bma-live', 'bma-qa'];

            for (i; i < numberOfNameSuggestions; i++) {
                serverName = $scope.generateServerName($scope.nameSuggestions[i].suffix);
                $scope.nameSuggestions[i].available = !ValidationService.doesArrayContainsItem($scope.serverNames, serverName);
            }
        });
    });

}]);