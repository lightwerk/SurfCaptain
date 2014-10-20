/* global describe,beforeEach,afterEach,module,it,expect,inject,spyOn */

describe('GlobalServerController', function () {
    'use strict';
    var ctrl, scope, q, SettingsRepositoryMock;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, _$q_) {
        scope = $rootScope.$new();
        q = _$q_;

        SettingsRepositoryMock = {
            getSettings: function () {
                var def = q.defer();
                return def.promise;
            }
        };

        ctrl = $controller('GlobalServerController', {
            $scope: scope,
            SettingsRepository: SettingsRepositoryMock
        });
    }));

    //#################
    // setServerNames #
    //#################
    describe('->setServerNames()', function () {

        beforeEach(function () {
            scope.serverNames = ['foo', 'bar'];
        });

        it('should be defined.', function () {
            expect(ctrl.setServerNames).toBeDefined();
        });

        it('should set $scope.serverNames to empty array if $scope.Servers is also empty.', function () {
            ctrl.setServerNames();
            expect(scope.serverNames).toEqual([]);
        });

        it('should set $scope.serverNames to empty array if $scope.Servers is an empty object.', function () {
            scope.servers = {};
            ctrl.setServerNames();
            expect(scope.serverNames).toEqual([]);
        });

        it('should set $scope.serverNames to names of presets in $scope.Servers.', function () {
            scope.servers = {
                presetA: {},
                presetB: {}
            };
            ctrl.setServerNames();
            expect(scope.serverNames).toEqual(['presetA', 'presetB']);
        });

        afterEach(function () {
            scope.serverNames = [];
        });
    });

    //##############
    // getSettings #
    //##############
    describe('->getSettings()', function () {

        it('should be defined.', function () {
            expect(ctrl.getSettings).toBeDefined();
        });

        it('should call SettingsRepository.getSettings()', function () {
            spyOn(SettingsRepositoryMock, 'getSettings').andCallThrough();
            ctrl.getSettings();
            expect(SettingsRepositoryMock.getSettings).toHaveBeenCalled();
        });

    });


});
