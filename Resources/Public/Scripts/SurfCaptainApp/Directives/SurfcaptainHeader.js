/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('surfcaptainHeader', surfcaptainHeader);

    /* @ngInject */
    function surfcaptainHeader($routeParams, $location, FavorService) {

        function linker(scope) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.itemName;
            scope.context = lastUrlPart === scope.project ? '' : lastUrlPart;
            scope.favorites = FavorService.getFavoriteProjects();
        }

        return {
            restrict: 'E',
            templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/Header.html',
            scope: {
                icon: '@icon'
            },
            link: linker
        };
    }
}());