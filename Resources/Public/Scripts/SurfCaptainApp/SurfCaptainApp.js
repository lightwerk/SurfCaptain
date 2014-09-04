/*global angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain', ['ngRoute', 'xeditable', 'ngAnimate', 'ngMessages', 'ngBiscuit'])
    .config(['$routeProvider', function ($routeProvider) {
        var templatePath = '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/';
        $routeProvider.
            when('/', {
                templateUrl: templatePath + 'Projects.html',
                controller: 'ProjectsController'
            }).
            when('/project/:projectName', {
                templateUrl: templatePath + 'Project.html',
                controller: 'ProjectController'
            }).
            when('/project/:projectName/deploy', {
                templateUrl: templatePath + 'Deploy.html',
                controller: 'DeployController'
            }).
            when('/project/:projectName/sync', {
                templateUrl: templatePath + 'Sync.html',
                controller: 'SyncController'
            }).
            when('/project/:projectName/server', {
                templateUrl: templatePath + 'Server.html',
                controller: 'ServerController'
            }).
            when('/about', {
                templateUrl: templatePath + 'About.html',
                controller: 'AboutController'
            }).
            when('/globalserver', {
                templateUrl: templatePath + 'GlobalServer.html',
                controller: 'GlobalServerController'
            }).
            when('/extensions', {
                templateUrl: templatePath + 'Extensions.html',
                controller: 'ExtensionsController'
            }).
            when('/deployments', {
                templateUrl: templatePath + 'Deployments.html',
                controller: 'DeploymentsController'
            }).
            when('/project/:projectName/deployment/:deploymentId', {
                templateUrl: templatePath + 'SingleDeployment.html',
                controller: 'SingleDeploymentController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
    .value('version', '0.15_beta2')
    .constant('SEVERITY', {
        ok: 0,
        info: 1,
        warning: 2,
        error: 3
    })
    .constant('CONFIG', {
        applicationTypes: {
            deployTYPO3: 'TYPO3\\CMS\\Deploy',
            syncTYPO3: 'TYPO3\\CMS\\Shared'
        }
    });

angular.module('surfCaptain').run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3';
}]);