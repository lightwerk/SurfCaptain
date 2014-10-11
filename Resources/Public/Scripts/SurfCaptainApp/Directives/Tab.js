/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('tab', tab);

    /* @ngInject */
    function tab() {
        return function (scope, element) {
            element.bind('click', function (e) {
                e.preventDefault();
                angular.element(this).tab('show');
            });
        };
    }
}());