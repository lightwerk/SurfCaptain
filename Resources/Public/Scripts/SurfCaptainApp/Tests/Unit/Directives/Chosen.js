/* global describe,beforeEach,module,it,expect,inject,angular */

describe('chosen', function () {
    'use strict';
    var element, scope;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($rootScope, $compile) {
        element = angular.element('<select chosen="deployableCommits"/>');
        scope = $rootScope;
        $compile(element)(scope);
        scope.$digest();
    }));

    it('should initialize chosen library that should create a div with according class after the element', function () {
        expect(element.next().hasClass('chosen-container')).toBeTruthy();
    });
});