/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .filter('logCodeFilter', logCodeFilter);

    /* @ngInject */
    function logCodeFilter() {
        return function (input) {
            switch (input) {
                case 3:
                case '3':
                    return 'error';
                case 4:
                case '4':
                    return 'warning';
                case 5:
                case '5':
                    return 'notice';
                case 6:
                case '6':
                    return 'info';
                case 7:
                case '7':
                    return 'debug';
                default:
                    return input;
            }
        };
    }
}());