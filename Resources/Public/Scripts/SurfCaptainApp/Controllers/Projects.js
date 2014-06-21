/*jslint browser: true*/

'use strict';
app.controller('ProjectsController', ['$scope', '$http', 'projectsService', function ($scope, $http, projectsService) {
    $scope.ordering = 'name';
    projectsService.getProjects().then(function (response) {
        $scope.projects = response.projects;
    });
}]);