/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('spinner', function () {
    var linker = function (scope, element, attrs) {
    };

    return {
        restrict: 'E',
        template: '<i class="fa fa-spinner fa-spin fa-4x"></i>',
        link: linker
    };
});