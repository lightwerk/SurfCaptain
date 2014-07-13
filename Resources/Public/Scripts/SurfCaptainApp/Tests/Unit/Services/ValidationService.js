/*global describe,beforeEach,module,it,expect,inject*/

describe('ValidationService', function () {
    var validationService;

    // Load the module
    beforeEach(function () {
        module('surfCaptain');

        inject(function (_ValidationService_) {
            validationService = _ValidationService_;
        });
    });

    it('->hasLength should return true if passed minLength is exceeded', function () {
        var res = validationService.hasLength('foo', 1, 'bar');
        expect(res).toEqual(true);
    });

    it('->hasLength should return true if passed minLength is met', function () {
        var res = validationService.hasLength('foo', 3, 'bar');
        expect(res).toEqual(true);
    });

    it('->hasLength should return a passed string if passed minLength is not reached', function () {
        var res = validationService.hasLength('foo', 10, 'bar');
        expect(res).toEqual('bar');
    });

    it('->hasLength should return false if passed minLength is not reached and no message was passed', function () {
        var res = validationService.hasLength('foo', 10);
        expect(res).toEqual(false);
    });

    it('->doesLastCharacterMatch should return true if the passed string ends with the passed character', function () {
        var res = validationService.doesLastCharacterMatch('foo', 'o', 'bar');
        expect(res).toEqual(true);
    });

    it('->doesLastCharacterMatch should return the passed message if the passed string does not end with the passed character', function () {
        var res = validationService.doesLastCharacterMatch('foo', 'f', 'bar');
        expect(res).toEqual('bar');
    });

    it('->doesLastCharacterMatch should return false if the passed string does not end with the passed character and no message was passed', function () {
        var res = validationService.doesLastCharacterMatch('foo', 'f');
        expect(res).toEqual(false);
    });

});