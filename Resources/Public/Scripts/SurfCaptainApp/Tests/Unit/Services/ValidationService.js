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

    it('should have a method hasLength', function () {
        expect(validationService.hasLength).toBeDefined();
    });

    describe('hasLength', function () {

        it('should return true if passed minLength is exceeded', function () {
            var res = validationService.hasLength('foo', 1, 'bar');
            expect(res).toEqual(true);
        });

        it('should return true if passed minLength is met', function () {
            var res = validationService.hasLength('foo', 3, 'bar');
            expect(res).toEqual(true);
        });

        it('should return a passed string if passed minLength is not reached', function () {
            var res = validationService.hasLength('foo', 10, 'bar');
            expect(res).toEqual('bar');
        });

        it('should return false if passed minLength is not reached and no message was passed', function () {
            var res = validationService.hasLength('foo', 10);
            expect(res).toEqual(false);
        });
    });

    it('should have a method doesLastCharacterMatch', function () {
        expect(validationService.doesLastCharacterMatch).toBeDefined();
    });

    describe('doesLastCharacterMatch', function () {
        it('should return true if the passed string ends with the passed character', function () {
            var res = validationService.doesLastCharacterMatch('foo', 'o', 'bar');
            expect(res).toEqual(true);
        });

        it('should return the passed message if the passed string does not end with the passed character', function () {
            var res = validationService.doesLastCharacterMatch('foo', 'f', 'bar');
            expect(res).toEqual('bar');
        });

        it('should return false if the passed string does not end with the passed character and no message was passed', function () {
            var res = validationService.doesLastCharacterMatch('foo', 'f');
            expect(res).toEqual(false);
        });
    });

    it('should have a method doesArrayContainsItem', function () {
        expect(validationService.doesArrayContainsItem).toBeDefined();
    });

    describe('doesArrayContainsItem', function () {
        it('should return true if passed array contains passed item', function () {
            expect(validationService.doesArrayContainsItem([1, 2, 3, 4, 5], 4)).toEqual(true);
            expect(validationService.doesArrayContainsItem(['a', 'b', 'c', 'd'], 'b')).toEqual(true);
        });

        it('should return false if passed array does not contains passed item', function () {
            expect(validationService.doesArrayContainsItem([1, 2, 3, 4, 5], 6)).toEqual(false);
            expect(validationService.doesArrayContainsItem(['a', 'b', 'c', 'd'], 'z')).toEqual(false);
        });

        it('should return false if passed array is empty', function () {
            expect(validationService.doesArrayContainsItem([], 11)).toEqual(false);
        });

        it('should return false if first argument is no array', function () {
            expect(validationService.doesArrayContainsItem({}, 11)).toEqual(false);
        });

        it('should return the passed string if passed array does not contains passed item', function () {
            expect(validationService.doesArrayContainsItem([1, 2, 3], 11, 'foo')).toEqual('foo');
        });

        it('should return the passed string if passed array is empty', function () {
            expect(validationService.doesArrayContainsItem([], 11, 'foo')).toEqual('foo');
        });

        it('should return the passed string if first argument is no array', function () {
            expect(validationService.doesArrayContainsItem({}, 11, 'foo')).toEqual('foo');
        });
    });

});