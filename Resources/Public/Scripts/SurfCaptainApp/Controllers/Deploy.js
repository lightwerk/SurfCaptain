/*jslint browser: true*/

'use strict';
app.controller('DeployController', ['$scope', '$routeParams', 'projectsService', function ($scope, $routeParams, projectsService) {
    $scope.name = $routeParams.itemName;
    $scope.project = {};

    projectsService.getProjects().then(function (response) {
        var length,
            i = 0;
        $scope.projects = response.projects;
        length = $scope.projects.length;
        for (i; i < length; i++) {
            if ($scope.projects[i]['name'] === $scope.name) {
                $scope.project = $scope.projects[i];
                break;
            }
        }
    });
}]);