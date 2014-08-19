/*global describe,beforeEach,module,it,expect,inject, angular*/

describe('PresetService', function () {
    var presetService, configuration, expectedPreset,
        expectedPresetSkeleton = {
            "options": {
                "repositoryUrl": '',
                "documentRoot": '',
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
        inject(function (_PresetService_) {
            presetService = _PresetService_;
        });
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

        it('should return a copy of the preset skeleton with documentRoot set from configuration.', function () {
            var documentRoot = '/var/www/myProject/live/htdocs/',
                preset = presetService.getNewPreset({defaultDocumentRoot: documentRoot});
            expectedPreset.options.documentRoot = documentRoot;
            expect(preset).toEqual(expectedPreset);
        });
    });

});