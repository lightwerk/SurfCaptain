/*global angular*/
/*jslint node: true */

'use strict';
var surfCaptain = angular.module('surfCaptain', ['ngRoute', 'xeditable', 'ngAnimate', 'ngMessages'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Projects.html',
                controller: 'ProjectsController'
            }).
            when('/project/:itemName', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Project.html',
                controller: 'ProjectController'
            }).
            when('/project/:itemName/deploy', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Deploy.html',
                controller: 'DeployController'
            }).
            when('/project/:itemName/sync', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Sync.html',
                controller: 'SyncController'
            }).
            when('/project/:itemName/server', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Server.html',
                controller: 'ServerController'
            }).
            when('/about', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/About.html',
                controller: 'AboutController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
    .value('version', '0.5.7')
    .value('domain', 'http://api.surfcaptain.local.loc/');

surfCaptain.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});