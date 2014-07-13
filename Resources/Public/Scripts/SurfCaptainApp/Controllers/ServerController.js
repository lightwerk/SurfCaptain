/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ServerController', ['$scope', '$controller', 'ServerRepository', 'ValidationService', function ($scope, $controller, ServerRepository, ValidationService) {

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

    $scope.contexts = [
        'Production', 'Development', 'Staging'
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
        var res = ValidationService.hasLength(data, 1, 'DocRoot must not be empty!');
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
        if ($scope.contexts.indexOf(data) > -1) {
            return true;
        }
        return 'Context is not valid!';
    };

    $scope.$watch('project', function (newValue, oldValue) {
        if (newValue.name === undefined) {
            return;
        }
        ServerRepository.getServers().then(function (response) {
            $scope.servers = response.filter(function (entry) {
                return entry.project === newValue.id;
            });
            $scope.serverNames = ['bma-live', 'bma-qa'];
        });
    });

}]);