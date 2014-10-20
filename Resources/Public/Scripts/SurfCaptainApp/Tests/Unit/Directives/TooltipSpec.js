/* global describe,beforeEach,module,it,expect,inject,angular */

describe('tooltip', function () {
    'use strict';
    var element, scope;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($rootScope, $compile) {
        element = angular.element('<span tooltip title="foo"></span>');
        scope = $rootScope;
        $compile(element)(scope);
        scope.$digest();
    }));

    it('should initialize bootstrap tooltip that should set data attribute original-title', function () {
        expect(element.data('originalTitle')).toEqual('foo');
    });
});