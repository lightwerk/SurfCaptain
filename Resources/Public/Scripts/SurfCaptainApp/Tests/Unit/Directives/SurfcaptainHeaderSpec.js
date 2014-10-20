/* global describe,module,it,jasmine,expect,inject,angular,spyOn */

describe('surfcaptainHeader', function () {
    'use strict';
    var element, scope, setUp, $httpBackend, FavorService,
        LocationMock = function () {
            var pathStr = '/project/bar';
            this.path = function () {
                return pathStr;
            };
        };

    setUp = function (project) {
        module('surfCaptain', 'surfCaptainPartials', function ($provide) {
            $provide.decorator('$routeParams', function () {
                var mock = {itemName: project || 'project'};
                return mock;
            });
            $provide.decorator('$location', function ($delegate) {
                $delegate.path = jasmine.createSpy().andCallFake(new LocationMock().path);
                return $delegate;
            });
        });

        inject(function ($routeParams, $location, $rootScope, $compile, _$httpBackend_, _FavorService_) {
            element = angular.element('<surfcaptain-header icon="foo"></surfcaptain-header>');
            scope = $rootScope;
            $httpBackend = _$httpBackend_;
            FavorService = _FavorService_;

            $httpBackend.when('GET', '/api/repository').respond(true);
            $httpBackend.expect('GET', '/api/repository');

            spyOn(FavorService, 'getFavoriteProjects');

            $compile(element)(scope);
            scope.$digest();
        });
    };


    it('should contain the font awesome passed to the directive', function () {
        setUp();
        expect(element.find('h1').find('.fa').hasClass('fa-foo')).toBeTruthy();
    });

    it('should set scope.context as container class if it does not match scope.project', function () {
        setUp();
        expect(element.hasClass('bar')).toBeTruthy();
    });

    it('should not set scope.context as container class if it does match scope.project', function () {
        setUp('bar');
        expect(element.hasClass('bar')).toBeFalsy();
    });

    it('should call getFavoriteProjects on FavorService.', function () {
        setUp();
        expect(FavorService.getFavoriteProjects).toHaveBeenCalled();
    });
});