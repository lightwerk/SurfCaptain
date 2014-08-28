/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('chosen', function () {
    var linker = function (scope, element, attrs) {
        var list = attrs.chosen;

        scope.$watchCollection(list, function () {
            element.trigger('liszt:updated');
            element.trigger('chosen:updated');
        });

        element.chosen({
            search_contains: true
        });
    };

    return {
        restrict: 'A',
        link: linker
    };
});