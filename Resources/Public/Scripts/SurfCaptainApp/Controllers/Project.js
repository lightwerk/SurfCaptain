/*jslint browser: true*/

'use strict';
app.controller('ProjectController', ['$scope', '$routeParams', 'projectsService', function ($scope, $routeParams, projectsService) {
    $scope.name = $routeParams.itemName;
    $scope.ordering = 'date';
    $scope.constraint = '';
    $scope.project = {};

    projectsService.getProjects().then(function (response) {
        var length,
            i = 0;
        $scope.projects = response.projects;
        length = $scope.projects.length;
        for (i; i < length; i++) {
            if ($scope.projects[i]['name'] === $scope.name) {
                $scope.project = $scope.projects[i];
                break;
            }
        }
    });

    $scope.history = [{
            application: 'Sync',
            date: '2012-09-07T00:35:17+00:00',
            server: 'dev.loc'
        },
        {
            application: 'Deploy',
            date: '2012-12-07T10:35:17+00:00',
            server: 'project-qa',
            gitcheckout: 'dev-master',
            commit: '1234567890'
        },
        {
            application: 'Deploy',
            date: '2013-09-07T14:33:17+00:00',
            server: 'project-production',
            gitcheckout: 'dev-master',
            commit: '1234567890'
        },
        {
            application: 'Deploy',
            date: '2013-10-29T15:21:14+01:00',
            server: 'project-production',
            gitcheckout: '1.0.0',
            commit: '1234567890'
        },
        {
            application: 'Sync',
            date: '2013-10-29T15:21:14+01:00',
            server: 'dlg-system'
        },
        {
            application: 'Deploy',
            date: '2014-06-07T12:02:10+00:00',
            server: 'project-production',
            gitcheckout: '1.0.1',
            commit: '1234567890'
        }];
}]);