/*jslint browser: true*/
'use strict';
var surfCaptain = angular.module('surfCaptain', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
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
    }])
    .value('version', '0.3.0');
