/* global angular */
/* jshint -W044:true */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .filter('DeploymentTypeFilter', DeploymentTypeFilter);

    /* @ngInject */
    function DeploymentTypeFilter() {
        return function (input) {
            switch (input) {
                case 'TYPO3\CMS\Deploy':
                case 'TYPO3\\CMS\\Deploy':
                    return 'Deployment';
                case 'TYPO3\CMS\Shared':
                case 'TYPO3\\CMS\\Shared':
                    return 'Sync';
                default:
                    return input;
            }
        };
    }
}());