/*jslint browser: true*/

'use strict';
surfCaptain.controller('DeployController', ['$scope', '$routeParams', 'ProjectRepository', 'GitRepository', 'ServerRepository', function ($scope, $routeParams, ProjectRepository, GitRepository, ServerRepository) {
    var loadingString = 'loading ...';
    $scope.name = $routeParams.itemName;
    $scope.project = {};
    $scope.deployableCommits = [
        {
            name: loadingString,
            group: 'Tags'
        },
        {
            name: loadingString,
            group: 'Branches'
        }
    ];
    $scope.tags = [];
    $scope.branches = [];

    $scope.unsetLoadingKeyForGroup = function (group) {
        var key;
        for (key in $scope.deployableCommits) {
            if ($scope.deployableCommits.hasOwnProperty(key)) {
                if ($scope.deployableCommits[key].name !== undefined
                    && $scope.deployableCommits[key].group !== undefined
                    && $scope.deployableCommits[key].name === loadingString
                    && $scope.deployableCommits[key].group === group) {
                    $scope.deployableCommits.splice(key, 1);
                    break;
                }
            }
        }
    };

    this.init = function () {
        ProjectRepository.getProjectByName($scope.name, function (project) {
            $scope.project = project;
        });
    };
    this.init();

    $scope.$watch('project', function (newValue, oldValue) {
        var id;
        if (newValue.id === undefined) {
            return;
        }
        id = newValue.id;
        GitRepository.getTagsByProjectId(id.toString()).then(
            function (response) {
                $scope.unsetLoadingKeyForGroup('Tags');
                $scope.tags = response.tags;
                $scope.deployableCommits = jQuery.merge($scope.tags, $scope.deployableCommits);
            },
            function (reason) {
                $scope.unsetLoadingKeyForGroup('Tags');
            }
        );
        GitRepository.getBranchesByProjectId(id.toString()).then(
            function (response) {
                $scope.unsetLoadingKeyForGroup('Branches');
                $scope.branches = response.branches;
                $scope.deployableCommits = jQuery.merge($scope.branches, $scope.deployableCommits);
            },
            function (reason) {
                $scope.unsetLoadingKeyForGroup('Branches');
            }
        );
        ServerRepository.getServers().then(function (response) {
            $scope.servers = response.filter(function (entry) {
                return entry.project === newValue.id;
            });
        });
    });

}]);