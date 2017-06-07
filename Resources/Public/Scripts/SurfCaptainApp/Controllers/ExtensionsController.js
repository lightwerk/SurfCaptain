/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ExtensionsController', ExtensionsController);

    /* @ngInject */
    function ExtensionsController($scope, ExtensionRepository, FlashMessageService) {

        $scope.translateType = translateType;

        activate();

        function activate() {
            ExtensionRepository.getExtensions().then(
                function (response) {
                    $scope.packageList = response.packageList;
                    $scope.projectList = response.projectList;
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
                case 1:
                    return 'in Repo';
                case 2:
                    return 'composer';
            }
        }
    }
}());
