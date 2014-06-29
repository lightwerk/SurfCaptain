/*global angular*/
/*jslint node: true */

'use strict';
var surfCaptain = angular.module('surfCaptain', ['ngRoute', 'xeditable', 'ngAnimate'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'Scripts/SurfCaptainApp/Templates/Projects.html',
                controller: 'ProjectsController'
            }).
            when('/project/:itemName', {
                templateUrl: 'Scripts/SurfCaptainApp/Templates/Project.html',
                controller: 'ProjectController'
            }).
            when('/project/:itemName/deploy', {
                templateUrl: 'Scripts/SurfCaptainApp/Templates/Deploy.html',
                controller: 'DeployController'
            }).
            when('/project/:itemName/sync', {
                templateUrl: 'Scripts/SurfCaptainApp/Templates/Sync.html',
                controller: 'SyncController'
            }).
            when('/project/:itemName/server', {
                templateUrl: 'Scripts/SurfCaptainApp/Templates/Server.html',
                controller: 'ServerController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
    .value('version', '0.5.5')
    .value('domain', 'http://api.surfcaptain.local.loc/');

surfCaptain.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});