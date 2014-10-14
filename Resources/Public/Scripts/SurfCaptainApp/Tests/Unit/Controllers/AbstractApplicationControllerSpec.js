/* global describe,beforeEach,module,it,expect,inject,spyOn */

describe('AbstractApplicationController', function () {
   'use strict';

    var scope, ctrl, PresetService;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, _PresetService_) {
        scope = $rootScope.$new();
        PresetService = _PresetService_;
        ctrl = $controller('AbstractApplicationController', {
            $scope: scope,
            PresetService: PresetService
        });
    }));

    describe('$scope.getRootContext.', function () {

        beforeEach(function () {
            spyOn(PresetService, 'getRootContext');
            scope.contexts = [];
            scope.getRootContext('foo');
        });

        it('should be defined.', function () {
            expect(scope.getRootContext).toBeDefined();
        });

        it('should call getRootContext on PresetService.', function () {
            expect(PresetService.getRootContext).toHaveBeenCalled();
        });

        it('should pass scope.contexts and the passed string to getRootContext on PresetService.', function () {
            expect(PresetService.getRootContext).toHaveBeenCalledWith('foo', scope.contexts);
        });
    });
});