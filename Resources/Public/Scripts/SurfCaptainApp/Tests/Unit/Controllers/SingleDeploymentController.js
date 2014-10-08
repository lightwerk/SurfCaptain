/*global describe,beforeEach,module,it,xit,expect,inject,spyOn, jasmine*/

describe('SingleDeploymentController', function () {
    'use strict';
    var ctrl, scope, $location, DeploymentRepository, $q, success = true, $routeParams, $cacheFactory, setTimeoutSpy;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, _$location_, _DeploymentRepository_, _$q_, _$cacheFactory_) {
        $location = _$location_;
        scope = $rootScope.$new();
        DeploymentRepository = _DeploymentRepository_;
        $q = _$q_;
        $cacheFactory = _$cacheFactory_;
        setTimeoutSpy = jasmine.createSpy('setTimeout');
        ctrl = $controller('SingleDeploymentController', {
            $scope: scope,
            $location: $location,
            DeploymentRepository: DeploymentRepository,
            $cacheFactory: $cacheFactory
        });
    }));

    describe('Initialization', function () {
        it('should initialize $scope.finished with false.', function () {
            expect(scope.finished).toBeFalsy();
        });

        it('should initialize $scope.noLog with false.', function () {
            expect(scope.noLog).toBeFalsy();
        });

    });

    it('should have a method init().', function () {
        expect(ctrl.init).toBeDefined();
    });

    describe('->init()', function () {
        beforeEach(function () {
            spyOn(ctrl, 'getDeployment');
            ctrl.init();
        });

        it('should call getDeployment() on controller.', function () {
            expect(ctrl.getDeployment).toHaveBeenCalled();
        });
    });

    it('should have a method getDeployment().', function () {
        expect(ctrl.getDeployment).toBeDefined();
    });

    describe('->getDeployment()', function () {
        beforeEach(function () {
            spyOn(ctrl, 'initLiveLog');
            spyOn(ctrl, 'init');
            spyOn(DeploymentRepository, 'getSingleDeployment').andCallFake(
                function () {
                    var deferred = $q.defer();
                    if (success) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                    return deferred.promise;
                }
            );
        });

        it('should call DeploymentRepository.getSingleDeployment.', function () {
            ctrl.getDeployment();
            expect(DeploymentRepository.getSingleDeployment).toHaveBeenCalled();
        });
    });

    it('should have a method initLiveLog().', function () {
        expect(ctrl.initLiveLog).toBeDefined();
    });

    describe('->initLiveLog()', function () {
        beforeEach(function () {
            scope.deployment = {
                __identity: 'foo',
                someProperty: 'bar'
            };
        });

        it('should store $scopeDeployment in deploymentCache of $cacheFactory if status is "success".', function () {
            scope.deployment.status = 'success';
            ctrl.initLiveLog();
            expect($cacheFactory.get('deploymentCache').get('foo')).toEqual(scope.deployment);
        });

        it('should store $scopeDeployment in deploymentCache of $cacheFactory if status is "failed".', function () {
            scope.deployment.status = 'failed';
            ctrl.initLiveLog();
            expect($cacheFactory.get('deploymentCache').get('foo')).toEqual(scope.deployment);
        });

        it('should store $scopeDeployment in deploymentCache of $cacheFactory if status is "cancelled".', function () {
            scope.deployment.status = 'cancelled';
            ctrl.initLiveLog();
            expect($cacheFactory.get('deploymentCache').get('foo')).toEqual(scope.deployment);
        });

        it('should call ctrl.getDeployment after one second if status is "waiting"', function () {
            spyOn(ctrl, 'getDeployment');
            scope.deployment.status = 'waiting';
            jasmine.Clock.useMock();
            ctrl.initLiveLog();
            jasmine.Clock.tick(1000);
            expect(ctrl.getDeployment).toHaveBeenCalled();
        });

        it('should call ctrl.getDeployment after one second if status is "running"', function () {
            spyOn(ctrl, 'getDeployment');
            scope.deployment.status = 'running';
            jasmine.Clock.useMock();
            ctrl.initLiveLog();
            jasmine.Clock.tick(1000);
            expect(ctrl.getDeployment).toHaveBeenCalled();
        });
    });

    describe('inheritance', function () {
        it('should fill a property "project" on $scope.', function () {
            expect(scope.project).toBeDefined();
        });
    });

});