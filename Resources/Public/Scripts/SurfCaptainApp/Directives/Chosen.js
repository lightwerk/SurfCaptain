/*global surfCaptain,angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('chosen', ['$timeout', function ($timeout) {
    var linker = function (scope, element) {

        scope.$watchCollection('chosen', function (value, old) {
            if (angular.isArray(value) && value !== old) {
                $timeout(
                    function () {
                        element.trigger('liszt:updated');
                        element.trigger('chosen:updated');
                    },
                    1000
                );
            }
        });

        element.chosen({
            search_contains: true
        });
    };

    return {
        restrict: 'A',
        link: linker,
        scope: {
            chosen: '='
        }
    };
}]);