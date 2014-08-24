/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('serverNameValidate', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            serverNames: '='
        },
        link: function (scope, elem, attr, ctrl) {
            // add a parser
            ctrl.$parsers.unshift(function (value) {
                var valid = scope.serverNames === undefined || scope.serverNames.indexOf(value) === -1;
                ctrl.$setValidity('server-name-validate', valid);

                // if it's valid, return the value to the model,
                // otherwise return undefined.
                return valid ? value : undefined;
            });

            // add a formatter
            ctrl.$formatters.unshift(function (value) {
                var valid = scope.serverNames === undefined || scope.serverNames.indexOf(value) === -1;
                ctrl.$setValidity('server-name-validate', valid);

                // return the value or nothing will be written to the DOM.
                return value;
            });

        }
    };
});