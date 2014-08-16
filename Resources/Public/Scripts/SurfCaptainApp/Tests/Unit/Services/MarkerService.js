/*global describe,beforeEach,module,it,expect,inject*/

describe('MarkerService', function () {
    var markerService, configuration;

    // Load the module
    beforeEach(function () {
        module('surfCaptain');
        inject(function (_MarkerService_) {
            markerService = _MarkerService_;
        });
    });

    it('should have a method replaceMarkers.', function () {
        expect(markerService.replaceMarkers).toBeDefined();
    });

    describe('->replaceMarkers()', function () {
        beforeEach(function () {
            configuration = {name: 'foo'};
        });

        it('should replace {{project}} with the name of the passed configuration.', function () {
            var result = markerService.replaceMarkers('{{project}}', configuration),
                result2 = markerService.replaceMarkers('/var/www/{{project}}/htdocs/', configuration),
                result3 = markerService.replaceMarkers('abc123{{project}}xyz890', configuration);
            expect(result).toEqual('foo');
            expect(result2).toEqual('/var/www/foo/htdocs/');
            expect(result3).toEqual('abc123fooxyz890');
        });

        it('should replace {{projectname}} with the name of the passed configuration.', function () {
            var result = markerService.replaceMarkers('{{projectname}}', configuration),
                result2 = markerService.replaceMarkers('/var/www/{{projectname}}/htdocs/', configuration),
                result3 = markerService.replaceMarkers('abc123{{projectname}}xyz890', configuration);
            expect(result).toEqual('foo');
            expect(result2).toEqual('/var/www/foo/htdocs/');
            expect(result3).toEqual('abc123fooxyz890');
        });

        it('should replace {{projectName}} with the name of the passed configuration.', function () {
            var result = markerService.replaceMarkers('{{projectName}}', configuration),
                result2 = markerService.replaceMarkers('/var/www/{{projectName}}/htdocs/', configuration),
                result3 = markerService.replaceMarkers('abc123{{projectName}}xyz890', configuration);
            expect(result).toEqual('foo');
            expect(result2).toEqual('/var/www/foo/htdocs/');
            expect(result3).toEqual('abc123fooxyz890');
        });

        it('should replace multiple occasions of {{project}} with the name of the passed configuration.', function () {
            var result = markerService.replaceMarkers('{{project}}{{project}}', configuration),
                result2 = markerService.replaceMarkers('/var/www/{{projectname}}/htdocs/{{project}}/', configuration),
                result3 = markerService.replaceMarkers('abc123{{projectName}}xyz{{project}}890', configuration);
            expect(result).toEqual('foofoo');
            expect(result2).toEqual('/var/www/foo/htdocs/foo/');
            expect(result3).toEqual('abc123fooxyzfoo890');
        });

        it('should not replace {{project}} if passed configuration has no name.', function () {
            expect(markerService.replaceMarkers('/var/www/{{project}}/htdocs/', {})).toEqual('/var/www/{{project}}/htdocs/');
        });

        it('should not replace a {{unknownMarker}}.', function () {
            var result = markerService.replaceMarkers('/var/{{anotherUnknownMarker}}/{{project}}/{{unknownMarker}}/htdocs/', {name: 'foo'});
            expect(result).toEqual('/var/{{anotherUnknownMarker}}/foo/{{unknownMarker}}/htdocs/');
            expect(markerService.replaceMarkers('/var/www/{{unknownMarker}}/htdocs/', {})).toEqual('/var/www/{{unknownMarker}}/htdocs/');

        });

        it('should return passed string if no configuration is passed at all.', function () {
            expect(markerService.replaceMarkers('aa{{project}}bb')).toEqual('aa{{project}}bb');
        });
    });

    it('should have a method getStringBeforeFirstMarker.', function () {
        expect(markerService.getStringBeforeFirstMarker()).toBeDefined();
    });

    describe('->getStringBeforeFirstMarker()', function () {

        it('should return the substring of the passed string before {{', function () {
            expect(markerService.getStringBeforeFirstMarker('abc{{marker}}xyz')).toEqual('abc');
        });

        it('should return the substring of the passed string before the first occurrence of {{', function () {
            expect(markerService.getStringBeforeFirstMarker('abc{{marker}}xy{{marker}}z')).toEqual('abc');
        });

        it('should return the passed string if it contains no marker {{', function () {
            expect(markerService.getStringBeforeFirstMarker('abcdefg')).toEqual('abcdefg');
        });

        it('should return empty string if passed argument is no string', function () {
            expect(markerService.getStringBeforeFirstMarker({})).toEqual('');
        });
    });

    it('should have a method getFirstMarker.', function () {
        expect(markerService.getFirstMarker()).toBeDefined();
    });

    describe('->getFirstMarker()', function () {

        it('should return the marker of the passed string', function () {
            expect(markerService.getFirstMarker('abc{{marker}}xyz')).toEqual('{{marker}}');
        });

        it('should return the first marker of the passed string', function () {
            expect(markerService.getFirstMarker('abc{{firstMarker}}xy{{secondMarker}}z')).toEqual('{{firstMarker}}');
        });

        it('should return null if the passed string contains no marker', function () {
            expect(markerService.getFirstMarker('abcdefg')).toBeNull();
        });

        it('should return null if passed argument is no string', function () {
            expect(markerService.getFirstMarker({})).toBeNull();
        });
    });
});