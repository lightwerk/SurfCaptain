/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('chosen', chosen);

    /* @ngInject */
    function chosen($timeout) {
        return {
            restrict: 'A',
            link: linker,
            scope: {
                chosen: '='
            }
        };

        function linker (scope, element) {
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
        }
    }
}());