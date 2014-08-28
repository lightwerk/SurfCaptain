/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('surfcaptainHeader', ['$routeParams', '$location', function ($routeParams, $location) {
    return {
        restrict: 'E',
        templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/Header.html',
        scope: {
            icon: '@icon'
        },
        link: function (scope, element, attributes) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.itemName;
            scope.context = lastUrlPart === scope.project ? '' : lastUrlPart;
        }
    };
}]);