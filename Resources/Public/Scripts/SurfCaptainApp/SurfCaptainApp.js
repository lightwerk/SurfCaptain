/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain', ['ngRoute', 'xeditable', 'ngAnimate', 'ngMessages', 'ngBiscuit', 'toaster'])
        .config(routeConfiguration)
        .config(toasterConfiguration)
        .value('version', '1.0.11')
        .constant('CONFIG', {
            applicationTypes: {
                deploy: 'Deploy',
                deployTYPO3: 'TYPO3\\CMS\\Deploy',
                syncTYPO3: 'TYPO3\\CMS\\Sync'
            }
        })
        .run(xeditableConfig);

    /* @ngInject */
    function routeConfiguration($routeProvider) {
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
            when('/settings', {
                templateUrl: templatePath + 'Settings.html',
                controller: 'SettingsController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }

    /* @ngInject */
    function toasterConfiguration(toasterConfig) {
        var customConfig = {
            'position-class': 'toast-bottom-right',
            'time-out': 5000,
            'close-button': true,
            'body-output-type': 'trustedHtml'
        };
        angular.extend(toasterConfig, customConfig);
    }

    /* @ngInject */
    function xeditableConfig(editableOptions) {
        editableOptions.theme = 'bs3';
    }

}());