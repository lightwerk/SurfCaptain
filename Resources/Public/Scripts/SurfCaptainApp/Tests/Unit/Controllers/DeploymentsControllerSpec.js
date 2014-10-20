/* global describe,beforeEach,module,it,expect,inject,spyOn */

describe('DeploymentsController', function () {
   'use strict';

    var scope, ctrl, DeploymentRepository, toaster, q;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, $q, _toaster_) {
        scope = $rootScope.$new();
        DeploymentRepository = {
            getAllDeployments: function () {
                var def = $q.defer();
                return def.promise;
            }
        };
        q = $q;
        toaster = _toaster_;
        ctrl = $controller('DeploymentsController', {
            $scope: scope,
            DeploymentRepository: DeploymentRepository,
            toaster: toaster
        });
    }));

    describe('initialization', function () {
        it('should initialize $scope.deployments with an empty array.', function () {
            expect(scope.deployments).toEqual([]);
        });
        it('should initialize $scope.finished with false.', function () {
            expect(scope.finished).toBeFalsy();
        });
    });

    describe('->init()', function () {

        it('should be defined.', function () {
            expect(ctrl.init).toBeDefined();
        });

        describe('call of DeploymentRepository.getAllDeployments', function () {
            it('should happen.', function () {
                spyOn(DeploymentRepository, 'getAllDeployments').andCallFake(function () {
                    return q.when('foo');
                });
                ctrl.init();
                expect(DeploymentRepository.getAllDeployments).toHaveBeenCalled();
            });

            describe('successful.', function () {
                beforeEach(function () {
                    spyOn(DeploymentRepository, 'getAllDeployments').andReturn(q.when({deployments: 'fooBar'}));
                    spyOn(ctrl, 'setDeployments');
                    ctrl.init();
                    scope.$digest();
                });
                it('should set $scope.finished to true.', function () {
                    expect(scope.finished).toBeTruthy();
                });
                it('should call setDeployments on controller.', function () {
                    expect(ctrl.setDeployments).toHaveBeenCalled();
                });
                it('should call setDeployments on controller with deployments property of response.', function () {
                    expect(ctrl.setDeployments).toHaveBeenCalledWith('fooBar');
                });
            });

            describe('unsuccessful.', function () {
                beforeEach(function () {
                    spyOn(DeploymentRepository, 'getAllDeployments').andReturn(q.reject('error'));
                    spyOn(toaster, 'pop');
                    spyOn(ctrl, 'setDeployments');
                    ctrl.init();
                    scope.$digest();
                });
                it('should set $scope.finished to true.', function () {
                    expect(scope.finished).toBeTruthy();
                });
                it('should not call setDeployments on controller.', function () {
                    expect(ctrl.setDeployments).not.toHaveBeenCalled();
                });
                it('should call pop on toaster.', function () {
                    expect(toaster.pop).toHaveBeenCalled();
                });
            });
        });
    });

    describe('->setDeployments()', function () {
        it('should be defined.', function () {
            expect(ctrl.setDeployments).toBeDefined();
        });
        it('should set $scope.Deployments to the passed value.', function () {
            ctrl.setDeployments('foo');
            expect(scope.deployments).toEqual('foo');
            ctrl.setDeployments([]);
            expect(scope.deployments).toEqual([]);
        });
    });
});