/*global describe,beforeEach,module,it,expect,inject*/

describe('AbstractSingleProjectController', function () {
    var ctrl, scope, routeParams;

    // Load the module
    beforeEach(module('surfCaptain'));

    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function ($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        routeParams = {
            itemName: 'foo'
        };
        // Create the controller
        ctrl = $controller('AbstractSingleProjectController', {
            $scope: scope,
            $routeParams: routeParams
        });
    }));

    it('should initialize scope.project with an empty object', function () {
        expect(scope.project).toEqual({});
    });

    it('should get the name from the $routeParams', function () {
        expect(scope.name).toBe('foo');
    });
});