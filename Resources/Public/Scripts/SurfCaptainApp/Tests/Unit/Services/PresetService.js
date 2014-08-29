/*global describe,beforeEach,module,it,expect,inject,angular,spyOn*/

describe('PresetService', function () {
    var presetService, configuration, expectedPreset, SettingsRepository, ValidationService, contexts
        expectedPresetSkeleton = {
            "options": {
                "repositoryUrl": '',
                "deploymentPath": '',
                "context": ''
            },
            "nodes": [
                {
                    "name": '',
                    "hostname": '',
                    "username": ''
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

    it('should have a method getNewPreset.', function () {
        expect(presetService.getNewPreset).toBeDefined();
    });

    describe('->getNewPreset()', function () {

        beforeEach(function () {
            expectedPreset = angular.copy(expectedPresetSkeleton);
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

    it('should have a method getRootContext.', function () {
        expect(presetService.getRootContext).toBeDefined();
    });

    describe('->getRootContext()', function () {
        beforeEach(function () {
            contexts = ['Production', 'Development'];
        });

        it('should call setContexts() on self.', function () {
            presetService.getRootContext('', contexts);
            expect(presetService.setContexts).toHaveBeenCalled();
        });

        it('should call ValidationService.doesStringStartWithSubstring as often as contexts are stored if passed string is no valid rootContext.', function () {
            presetService.getRootContext('Staging', contexts);
            expect(ValidationService.doesStringStartWithSubstring.callCount).toEqual(2);
        });

        it('should return empty string if passed string is no valid rootContext.', function () {
            var rootContext = presetService.getRootContext('Staging', contexts);
            expect(rootContext).toEqual('');
        });

        it('should return correct ootContext if passed string is valid rootContext.', function () {
            var rootContext = presetService.getRootContext('Production/Staging', contexts);
            expect(rootContext).toEqual('Production');
        });
    });

});