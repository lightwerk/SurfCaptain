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
                    return 'TYPO3 Deployment';
                case 'TYPO3\CMS\Sync':
                case 'TYPO3\\CMS\\Sync':
                    return 'TYPO3 Sync';
                case 'TYPO3\Flow\Deploy':
                case 'TYPO3\\Flow\\Deploy':
                    return 'Flow Deployment';
                case 'TYPO3\Flow\Sync':
                case 'TYPO3\\Flow\\Sync':
                    return 'Flow Sync';
                case 'Deploy':
                    return 'Simple Deployment';
                default:
                    return input;
            }
        };
    }
}());