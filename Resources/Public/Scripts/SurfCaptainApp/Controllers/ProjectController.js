/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ProjectController', ['$scope', '$controller', 'HistoryRepository', function ($scope, $controller, HistoryRepository) {

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

    $scope.ordering = 'date';
    $scope.constraint = '';

    $scope.$watch('project', function (newValue, oldValue) {
        if (newValue.name === undefined) {
            return;
        }

        HistoryRepository.getHistoryByProject($scope.project).then(function (response) {
            $scope.history = response;
        });
    });
}]);