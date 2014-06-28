/*jslint browser: true*/
'use strict';
surfCaptain.directive('surfcaptainHeader', ['$routeParams', '$location', function ($routeParams, $location) {
    return {
        restrict:'E',
        templateUrl: 'Scripts/SurfCaptainApp/Partials/Header.html',
        scope: {
            icon: '@icon'
        },
        link: function (scope, element, attributes) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.itemName;
            scope.context = lastUrlPart === scope.project ? '' : lastUrlPart;
        }
    }
}]);