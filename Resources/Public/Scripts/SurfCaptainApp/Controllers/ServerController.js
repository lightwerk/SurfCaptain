/*jslint browser: true*/

'use strict';
surfCaptain.controller('ServerController', ['$scope', '$routeParams', 'ProjectRepository', 'ServerRepository', function ($scope, $routeParams, ProjectRepository, ServerRepository) {
    $scope.name = $routeParams.itemName;
    $scope.project = {};

    this.init = function () {
        ProjectRepository.getProjects().then(function (response) {
            $scope.project = ProjectRepository.getProjectByName(response.projects, $scope.name);
        });
    };
    this.init();

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