/*global describe,beforeEach,afterEach,module,it,expect,inject*/

describe('ProjectRepository', function () {
    var projectRepository,
        $http,
        cacheFactory,
        url = '/api/repository',
        response = {
            repositories: [
                {
                    name: 'bar'
                },
                {
                    name: 'foo'
                }
            ]
        };

    // Load the module
    beforeEach(function () {
        module('surfCaptain');
        inject(function (_ProjectRepository_, _$httpBackend_, _$cacheFactory_) {
            projectRepository = _ProjectRepository_;
            $http = _$httpBackend_;
            cacheFactory = _$cacheFactory_;
        });
    });

    it('should init an empty projectCache in angulars cacheFactory.', function () {
        expect(cacheFactory.get('projectCache')).toBeDefined();
        expect(cacheFactory.get('projectCache').info().size).toEqual(0);
    });

    it('should init an empty projectsCache in angulars cacheFactory.', function () {
        expect(cacheFactory.get('projectsCache')).toBeDefined();
        expect(cacheFactory.get('projectsCache').info().size).toEqual(0);
    });

    it('should have a method "getProjects"', function () {
        expect(projectRepository.getProjects).toBeDefined();
    });

    describe('->getProjects()', function () {

        beforeEach(function () {
            $http.when(
                'GET',
                url
            ).respond(response);
        });

        afterEach(function () {
            $http.verifyNoOutstandingExpectation();
            $http.verifyNoOutstandingRequest();
            cacheFactory.get('projectCache').destroy();
            cacheFactory.get('projectsCache').destroy();
        });

        it('should call the API for projects data.', function () {
            $http.expectGET(url);
            projectRepository.getProjects();
            $http.flush();
        });

        it('should store each project instance in the angular cacheFactory.', function () {
            $http.expectGET(url);
            projectRepository.getProjects();
            $http.flush();
            expect(cacheFactory.get('projectCache').info().size).toEqual(2);
            expect(cacheFactory.get('projectCache').get('foo')).toEqual(response.repositories[1]);
        });

        it('should store response in the angular cacheFactory wit key "allProjects".', function () {
            $http.expectGET(url);
            projectRepository.getProjects();
            $http.flush();
            expect(cacheFactory.get('projectsCache').info().size).toEqual(1);
            expect(cacheFactory.get('projectsCache').get('allProjects')).toEqual(response.repositories);
        });

        it('should not perform request if "allProjects" are set in the angular cacheFactory.', function () {
            cacheFactory.get('projectsCache').put('allProjects', response.repositories);
            projectRepository.getProjects();
        });

    });

    it('should have a method "getProjectByName"', function () {
        expect(projectRepository.getProjectByName).toBeDefined();
    });

    describe('->getProjectByName()', function () {

        it('should return matching object from angular cacheFactory.', function () {
            var expectation = {name: 'bar'};
            cacheFactory.get('projectCache').put('foo', expectation);
            expect(projectRepository.getProjectByName('foo')).toEqual(expectation);
        });

        it('should store matching object of passed array in angular cacheFactory.', function () {
            expect(cacheFactory.get('projectCache').get('foo')).toBeUndefined();
            projectRepository.getProjectByName('bar', response.repositories);
            expect(cacheFactory.get('projectCache').get('foo')).toBeDefined();
            expect(cacheFactory.get('projectCache').get('foo')).toEqual(response.repositories[1]);
        });

        it('should throw an error if project is neither in cache nor in the passed array.', function () {
            // http://stackoverflow.com/questions/15349214/how-to-test-if-exception-is-thrown-in-angularjs
            function errorFunctionWrapper() {
                projectRepository.getProjectByName('foo');
            }
            expect(errorFunctionWrapper).toThrow();
        });
    });
});