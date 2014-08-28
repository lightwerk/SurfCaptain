/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('surfcaptainMenu', ['$routeParams', '$location', function ($routeParams, $location) {
    return {
        restrict: 'E',
        templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/Menu.html',
        scope: {},
        link: function (scope, element, attributes) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.projectName;
            scope.context = lastUrlPart === scope.project ? 'history' : lastUrlPart;
        }
    };
}]);