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
        when('/project/:itemName/deploy', {
            templateUrl: 'Templates/SurfCaptainApp/Deploy.html',
            controller: 'DeployController'
        }).
        when('/project/:itemName/sync', {
            templateUrl: 'Templates/SurfCaptainApp/Sync.html',
            controller: 'SyncController'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

app.factory('projectsService', function ($http) {
    var projectsService = {
        getProjects: function () {
            var promise = $http.get('Scripts/projectsss.json', {cache: true}).then(function (response) {
                return response.data;
            });
            return promise;
        }
    };
    return projectsService;
});