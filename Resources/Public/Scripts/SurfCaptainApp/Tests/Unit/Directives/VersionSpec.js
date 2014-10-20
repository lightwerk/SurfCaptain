/* global describe,beforeEach,module,it,expect,inject,angular */

describe('appVersion', function () {
    'use strict';
    var element, scope, currentVersion;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($rootScope, $compile, version) {
        currentVersion = version;
        element = angular.element('<span app-version></span>');
        scope = $rootScope;
        $compile(element)(scope);
        scope.$digest();
    }));

    it('should set the content of the element containing the directive to the current version', function () {
        expect(element.text()).toEqual(currentVersion);
    });
});