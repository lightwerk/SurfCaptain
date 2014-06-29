/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('SyncController', ['$scope', '$controller', function ($scope, $controller) {

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));
}]);