/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('startWithValidate', startWithValidate);

    /* @ngInject */
    function startWithValidate(ValidationService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                startWithValidate: '='
            },
            link: function (scope, elem, attr, ctrl) {
                // add a parser
                ctrl.$parsers.unshift(function (value) {
                    var i = 0,
                        length;

                    if (angular.isUndefined(scope.startWithValidate)) {
                        ctrl.$setValidity('start-with-validate', true);
                        return value;
                    }
                    length = scope.startWithValidate.length;

                    for (i; i < length; i++) {
                        if (ValidationService.doesStringStartWithSubstring(value, scope.startWithValidate[i])) {
                            ctrl.$setValidity('start-with-validate', true);
                            return value;
                        }
                    }

                    ctrl.$setValidity('start-with-validate', false);
                    return undefined;
                });

                // add a formatter
                ctrl.$formatters.unshift(function (value) {
                    var i = 0,
                        length;

                    if (angular.isUndefined(scope.startWithValidate)) {
                        ctrl.$setValidity('start-with-validate', true);
                        return value;
                    }
                    length = scope.startWithValidate.length;

                    for (i; i < length; i++) {
                        if (ValidationService.doesStringStartWithSubstring(value, scope.startWithValidate[i])) {
                            ctrl.$setValidity('start-with-validate', true);
                            return value;
                        }
                    }

                    ctrl.$setValidity('start-with-validate', false);
                    return value;
                });

            }
        };
    }
}());