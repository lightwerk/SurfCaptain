/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').filter('DeploymentTypeFilter', function () {
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
});