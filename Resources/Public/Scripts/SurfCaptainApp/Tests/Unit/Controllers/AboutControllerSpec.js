/*global describe,beforeEach,module,it,expect,inject,angular*/

describe('AboutController', function () {
    'use strict';
    var ctrl, scope;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('AboutController', {
            $scope: scope
        });
    }));

    describe('Initialization', function () {
        it('should initialize $scope.techs', function () {
            expect(scope.techs).toBeDefined();
        });

        it('should initialize $scope.techs as Array.', function () {
            expect(angular.isArray(scope.techs)).toBeTruthy();
        });

        it('should initialize $scope.techs as non-empty.', function () {
            expect(scope.techs.length).toBeGreaterThan(0);
        });

        it('should initialize $scope.subtechs', function () {
            expect(scope.subtechs).toBeDefined();
        });

        it('should initialize $scope.subtechs as Array.', function () {
            expect(angular.isArray(scope.subtechs)).toBeTruthy();
        });

        it('should initialize $scope.subtechs as non-empty.', function () {
            expect(scope.subtechs.length).toBeGreaterThan(0);
        });
    });

});