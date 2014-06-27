/*jslint browser: true*/
'use strict';
var surfCaptain = angular.module('surfCaptain', ['ngRoute', 'xeditable'])
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
        when('/project/:itemName/server', {
            templateUrl: 'Templates/SurfCaptainApp/Server.html',
            controller: 'ServerController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }])
    .value('version', '0.5.0')
    .value('domain', 'http://api.surfcaptain.local.loc/');

surfCaptain.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});