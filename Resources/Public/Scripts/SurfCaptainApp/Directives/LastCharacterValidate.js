/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('lastCharacterValidate', ['ValidationService', function (ValidationService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            character: '@character'
        },
        link: function (scope, elem, attr, ctrl) {
            var character = scope.character || '';
            // add a parser
            ctrl.$parsers.unshift(function (value) {
                var valid = value ? ValidationService.doesLastCharacterMatch(value.slice(-1), character) : false;
                ctrl.$setValidity('last-character-validate', valid);

                // if it's valid, return the value to the model,
                // otherwise return undefined.
                return valid ? value : undefined;
            });

            // add a formatter
            ctrl.$formatters.unshift(function (value) {
                var valid = value ? ValidationService.doesLastCharacterMatch(value.slice(-1), character) : false;
                ctrl.$setValidity('last-character-validate', valid);

                // return the value or nothing will be written to the DOM.
                return value;
            });

        }
    };
}]);