/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('surfcaptainMenu', surfcaptainMenu);

    /* @ngInject */
    function surfcaptainMenu($routeParams, $location) {

        return {
            restrict: 'E',
            templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/Menu.html',
            scope: {},
            link: linker,
            replace: true
        };

        function linker(scope) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.projectName;
            scope.context = lastUrlPart === scope.project ? 'history' : lastUrlPart;
        }
    }
}());