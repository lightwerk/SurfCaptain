/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('spinner', function () {
    var linker = function (scope, element, attrs) {
    };

    return {
        restrict: 'E',
        template: '<img src="/_Resources/Static/Packages/Lightwerk.SurfCaptain/Images/spinner.gif" width="30px" height="30px" />',
        link: linker
    };
});