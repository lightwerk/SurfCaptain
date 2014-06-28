/*jslint browser: true*/

'use strict';
surfCaptain.controller('ServerController', ['$scope', '$controller', 'ServerRepository', function ($scope, $controller, ServerRepository) {

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
     * Validates the updated Host string befor submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateHost = function (data) {
        if (data.length > 0) {
            return true;
        }
        return 'Host must not be empty!';
    };

    /**
     * Validates the updated DocumentRoot string befor submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateDocumentRoot = function (data) {
        if (data.length > 0) {
            if (data.charAt(data.length - 1) === '/') {
                return true;
            }
            return 'DocRoot must end with "/"!';
        }
        return 'DocRoot must not be empty!';
    };

    /**
     * Validates the updated Username string befor submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateUsername = function (data) {
        if (data.length > 0) {
            return true;
        }
        return 'User must not be empty!';
    };

    /**
     * Validates the updated Context string befor submitting to Server
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
        });
    });

}]);