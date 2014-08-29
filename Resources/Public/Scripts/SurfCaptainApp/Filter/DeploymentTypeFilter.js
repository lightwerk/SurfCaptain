/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').filter('DeploymentTypeFilter', function () {
    return function (input) {
        switch (input) {
        case 'TYPO3\CMS\Deploy':
        case 'TYPO3\\CMS\\Deploy':
            return 'Deployment';
        case 'TYPO3\CMS\Sync':
        case 'TYPO3\\CMS\\Sync':
            return 'Sync';
        default:
            return input;
        }
    };
});