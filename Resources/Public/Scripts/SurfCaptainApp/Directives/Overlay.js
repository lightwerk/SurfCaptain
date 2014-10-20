/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('overlay', overlay);

    /* @nInject */
    function overlay() {
        return {
            restrict: 'E',
            template: '<div data-ng-class="{false:\'overlay\'}[finished]"></div>',
            scope: {
                finished: '='
            }
        };
    }
}());

