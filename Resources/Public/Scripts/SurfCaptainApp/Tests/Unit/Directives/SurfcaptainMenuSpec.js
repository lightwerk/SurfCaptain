/* global describe,module,it,jasmine,expect,inject,angular */

describe('surfcaptainMenu', function () {
    'use strict';
    var element, scope, setUp;

    setUp = function (context) {
        var LocationMock = function () {
            var pathStr = '/project/' + context;
            this.path = function () {
                return pathStr;
            };
        };
        module('surfCaptain', 'surfCaptainPartials', function ($provide) {
            $provide.decorator('$routeParams', function () {
                var mock = {projectName: 'foo'};
                return mock;
            });
            $provide.decorator('$location', function ($delegate) {
                $delegate.path = jasmine.createSpy().andCallFake(new LocationMock().path);
                return $delegate;
            });
        });

        inject(function ($routeParams, $location, $rootScope, $compile) {
            element = angular.element('<surfcaptain-menu></surfcaptain-menu>');
            scope = $rootScope;

            $compile(element)(scope);
            scope.$digest();
        });
    };

    it('should fill project brand with upper case name from $routeParams', function () {
        setUp();
        expect(element.find('.project-brand').html()).toContain('FOO');
    });

    it('should disable the primary button if context matches project', function () {
        setUp('foo');
        expect(element.find('.btn-primary').attr('disabled')).toEqual('disabled');
        expect(element.find('.btn-success').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-warning').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-danger').attr('disabled')).not.toBeDefined();
    });

    it('should disable the success-button if context is server', function () {
        setUp('server');
        expect(element.find('.btn-primary').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-success').attr('disabled')).toEqual('disabled');
        expect(element.find('.btn-warning').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-danger').attr('disabled')).not.toBeDefined();
    });

    it('should disable the warning-button if context is sync', function () {
        setUp('sync');
        expect(element.find('.btn-primary').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-success').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-warning').attr('disabled')).toEqual('disabled');
        expect(element.find('.btn-danger').attr('disabled')).not.toBeDefined();
    });

    it('should disable the danger-button if context is deploy', function () {
        setUp('deploy');
        expect(element.find('.btn-primary').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-success').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-warning').attr('disabled')).not.toBeDefined();
        expect(element.find('.btn-danger').attr('disabled')).toEqual('disabled');
    });

    it('should insert the project name into the hrefs of all button links', function () {
        setUp();
        expect(element.find('.btn-primary').attr('href')).toEqual('#/project/foo');
        expect(element.find('.btn-success').attr('href')).toEqual('#/project/foo/server');
        expect(element.find('.btn-warning').attr('href')).toEqual('#/project/foo/sync');
        expect(element.find('.btn-danger').attr('href')).toEqual('#/project/foo/deploy');
    });
});