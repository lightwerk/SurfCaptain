/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('modal', modal);

    /* @nInject */
    function modal() {
        return {
            scope: {
                modal: '@modal'
            },
            link: function (scope, element) {
                element.bind('click', function () {
                    angular.element('.' + scope.modal).modal();
                });
            }
        };
    }
}());