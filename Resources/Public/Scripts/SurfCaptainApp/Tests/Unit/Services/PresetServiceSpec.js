/*global describe,beforeEach,module,it,expect,inject,angular,spyOn*/

describe('PresetService', function () {
    'use strict';
    var presetService, expectedPreset, SettingsRepository, ValidationService, contexts,
        expectedPresetSkeleton = {
            'options': {
                'repositoryUrl': '',
                'deploymentPath': '',
                'context': ''
            },
            'nodes': [
                {
                    'name': '',
                    'hostname': '',
                    'username': ''
                }
            ]
        };

    // Load the module
    beforeEach(function () {
        module('surfCaptain');
        inject(function (_PresetService_, _SettingsRepository_, _ValidationService_) {
            presetService = _PresetService_;
            SettingsRepository = _SettingsRepository_;
            ValidationService = _ValidationService_;
        });
        spyOn(presetService, 'setContexts');
        spyOn(ValidationService, 'doesStringStartWithSubstring').andCallThrough();
    });

    describe('->getNewPreset()', function () {

        beforeEach(function () {
            expectedPreset = angular.copy(expectedPresetSkeleton);
        });

        it('should be defined.', function () {
            expect(presetService.getNewPreset).toBeDefined();
        });

        it('should return a copy of the preset skeleton when no configuration is passed.', function () {
            var preset = presetService.getNewPreset();
            expect(preset).toEqual(expectedPreset);
        });

        it('should return a copy of the preset skeleton when passed configuration has no matching properties.', function () {
            var preset = presetService.getNewPreset({uselessProperty: ''});
            expect(preset).toEqual(expectedPreset);
        });

        it('should return a copy of the preset skeleton with user set from configuration.', function () {
            var user = 'dummy-user',
                preset = presetService.getNewPreset({defaultUser: user});
            expectedPreset.nodes[0].username = user;
            expect(preset).toEqual(expectedPreset);
        });

        it('should return a copy of the preset skeleton with deploymentPath set from configuration.', function () {
            var deploymentPath = '/var/www/myProject/live/htdocs/',
                preset = presetService.getNewPreset({defaultDeploymentPath: deploymentPath});
            expectedPreset.options.deploymentPath = deploymentPath;
            expect(preset).toEqual(expectedPreset);
        });
    });

    describe('->getRootContext()', function () {
        beforeEach(function () {
            contexts = ['Production', 'Development'];
        });

        it('should be defined.', function () {
            expect(presetService.getRootContext).toBeDefined();
        });

        it('should call setContexts() on self.', function () {
            presetService.getRootContext('', contexts);
            expect(presetService.setContexts).toHaveBeenCalled();
        });

        it('should call ValidationService.doesStringStartWithSubstring as often as contexts are stored if passed string is no valid rootContext.', function () {
            presetService.getRootContext('Staging', contexts);
            expect(ValidationService.doesStringStartWithSubstring.callCount).toEqual(2);
        });

        it('should return "unknown-context" string if passed string is no valid rootContext.', function () {
            var rootContext = presetService.getRootContext('Staging', contexts);
            expect(rootContext).toEqual('unknown-context');
        });

        it('should return correct ootContext if passed string is valid rootContext.', function () {
            var rootContext = presetService.getRootContext('Production/Staging', contexts);
            expect(rootContext).toEqual('Production');
        });
    });

    describe('->isPresetGlobal()', function () {

        it('should be defined.', function () {
            expect(presetService.isPresetGlobal).toBeDefined();
        });

        it('should return false if passed preset has property repositoryUrl defined.', function () {
            var preset = {
                applications: [
                    expectedPreset
                ]
            };
            preset.applications[0].options.repositoryUrl = 'myRepositoryUrl';
            expect(presetService.isPresetGlobal(preset)).toBeFalsy();
        });

        it('should return true if passed preset has no property repositoryUrl defined.', function () {
            var preset = {
                applications: [
                    expectedPreset
                ]
            };
            delete preset.applications[0].options.repositoryUrl;
            expect(presetService.isPresetGlobal(preset)).toBeTruthy();
        });

        it('should return false if passed preset is no valid preset.', function () {
            var preset = {};
            expect(presetService.isPresetGlobal(preset)).toBeFalsy();

        });
    });

});