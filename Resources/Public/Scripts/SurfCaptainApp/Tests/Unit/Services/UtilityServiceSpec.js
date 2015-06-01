/*global describe,beforeEach,module,it,expect,inject,angular*/

describe('UtilityService', function () {
    'use strict';

    var UtilityService, objectA, objectB, commits = [], commitA;

    // Load the module
    beforeEach(function () {
        module('surfCaptain');
        inject(function (_UtilityService_) {
            UtilityService = _UtilityService_;
        });
    });

    describe('->byCommitDate()', function () {

        beforeEach(function () {
            objectA = {
                commit: {
                    date: '2014-11-06T15:19:51.000+01:00'
                }
            };
            objectB = {
                commit: {
                    date: '2014-11-07T15:19:51.000+01:00'
                }
            };
        });

        it('should be defined.', function () {
            expect(UtilityService.byCommitDate).toBeDefined();
        });

        it('should return -1 if one object misses a commit property.', function () {
            expect(UtilityService.byCommitDate({}, objectB)).toEqual(-1);
            expect(UtilityService.byCommitDate(objectA, {})).toEqual(-1);
        });

        it('should return -1 if one object misses a commit.date property.', function () {
            expect(UtilityService.byCommitDate({commit:{}}, objectB)).toEqual(-1);
            expect(UtilityService.byCommitDate(objectA, {commit:{}})).toEqual(-1);
        });

        it('should return 1 if date of second object is greater than date of first object.', function () {
            expect(UtilityService.byCommitDate(objectA, objectB)).toEqual(1);
        });

        it('should return -1 if date of second object is less than date of first object.', function () {
            objectB.commit.date = '2014-11-02T15:19:51.000+01:00';
            expect(UtilityService.byCommitDate(objectA, objectB)).toEqual(-1);
        });
    });

    describe('->getDeployedTag()', function () {

        beforeEach(function () {
            commitA = {
                name: 'server-foo',
                type: 'Bar',
                commit: {
                    id: '12345',
                    committerName: 'John Doe',
                    message: '[TASK] some task'
                }
            };
            commits.push(commitA);
        });

        it('should be defined.', function () {
            expect(UtilityService.getDeployedTag).toBeDefined();
        });

        it('should return "No deployed commit found." if no matching name was found.', function () {
            expect(UtilityService.getDeployedTag('bar', commits)).toEqual('No deployed commit found.');
        });

        it('should return commit information if a matching commit was found with different name again.', function () {
            var commitB = angular.copy(commitA);
            commitB.name = 'foo';
            commits.push(commitB);
            expect(UtilityService.getDeployedTag('foo', commits)).toEqual(commitB.type + ' ' + commitB.name + ' - ' + commitB.commit.committerName + ': "' + commitB.commit.message + '"');
        });

        it('should return commit information if a matching commit was not found with different name again.', function () {
            var commitB = angular.copy(commitA);
            commitB.commit.id = '23456';
            commits.push(commitB);
            expect(UtilityService.getDeployedTag('foo', commits)).toEqual('sha1:' + ' ' + commitA.commit.id + ' - ' + commitA.commit.committerName + ': "' + commitA.commit.message + '"');
        });

        afterEach(function () {
            commits = [];
        });
    });

});