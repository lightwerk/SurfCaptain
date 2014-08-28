/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('overlay', function () {
    var linker = function (scope, element, attrs) {
    };

    return {
        restrict: 'E',
        template: '<div data-ng-class="{false:\'overlay\'}[finished]"></div>',
        scope: {
            finished: '='
        },
        link: linker
    };
});