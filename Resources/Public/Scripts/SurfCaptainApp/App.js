'use strict';
var app = angular.module('surfCaptain', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'Templates/SurfCaptainApp/Projects.html',
            controller: 'ProjectsController'
        }).
        when('/project/:itemName', {
            templateUrl: 'Templates/SurfCaptainApp/Project.html',
            controller: 'ProjectController'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

app.factory('projectsService', function ($http) {
    var projectsService = {
        getProjects: function () {
            var promise = $http.get('Scripts/projects.json', {cache: true}).then(function (response) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return projectsService;
});