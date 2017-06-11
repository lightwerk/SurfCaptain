/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ExtensionsController', ExtensionsController);

    /* @ngInject */
    function ExtensionsController($scope, ExtensionRepository, FlashMessageService) {

        $scope.translateType = translateType;
        $scope.addUpVersions = addUpVersions;
        $scope.sort = sort;
        $scope.setSorting = setSorting;
        $scope.sortBy = 'amount';
        $scope.sortInverse = true;

        activate();

        function activate() {
            ExtensionRepository.getExtensions().then(
                function (response) {
                    $scope.projects = response.crawlingResult.projects;
                    $scope.packages = response.crawlingResult.packages;
                },
                function (response) {
                    FlashMessageService.addErrorFlashMessageFromResponse(
                        response,
                        'Error!',
                        'Something went wrong.'
                    );
                }
            );
        }

        function translateType(type) {
            switch (parseInt(type)) {
                case 0:
                    return 'unknown';
                case 1:
                    return 'in Repo';
                case 2:
                    return 'composer';
            }
        }

        function addUpVersions(item) {
            var amount = 0;
            if (item.versions.length === 0) {
                return amount;
            }
            angular.forEach(item.versions, function (version) {
                amount += version.length;
            });
            return amount;
        }

        function sort(item) {
            if ($scope.sortBy === 'name') {
                return item.name;
            }
            if ($scope.sortBy === 'amount') {
                return $scope.addUpVersions(item);
            }
        }

        function setSorting(type) {
            if ($scope.sortBy === type) {
                $scope.sortInverse = !$scope.sortInverse;
            } else {
                $scope.sortBy = type;
                $scope.sortInverse = true;
            }
        }
    }
}());
