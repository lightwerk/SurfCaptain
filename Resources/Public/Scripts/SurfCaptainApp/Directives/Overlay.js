/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('overlay', overlay);

    /* @nInject */
    function overlay() {
        var linker = function () {};

        return {
            restrict: 'E',
            template: '<div data-ng-class="{false:\'overlay\'}[finished]"></div>',
            scope: {
                finished: '='
            },
            link: linker
        };
    }
}());

