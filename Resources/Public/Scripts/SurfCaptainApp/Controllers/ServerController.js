/*jslint browser: true*/

'use strict';
surfCaptain.controller('ServerController', ['$scope', '$routeParams', 'ProjectRepository', 'ServerRepository', function ($scope, $routeParams, ProjectRepository, ServerRepository) {
    $scope.name = $routeParams.itemName;
    $scope.project = {};
    $scope.contexts = [
        'Production', 'Development', 'Staging'
    ];

    this.init = function () {
        ProjectRepository.getProjects().then(function (response) {
            $scope.project = ProjectRepository.getProjectByName(response.projects, $scope.name);
        });
    };
    this.init();

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
        return 'Host must not be empty!';
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
            var key;
            $scope.servers = [];
            for (key in response.collections) {
                if (response.collections.hasOwnProperty(key)) {
                    if (response.collections[key]['project'] !== undefined
                        && response.collections[key]['project'] === newValue.name) {
                        $scope.servers.push(response.collections[key]);
                    }
                }
            }
        });
    });

}]);