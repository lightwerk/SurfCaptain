# How To Install

1. composer create-project --dev --keep-vcs typo3/flow-base-distribution flow-base dev-master
1. git clone git@bitbucket.org:lars85/lightwerk.surfcaptain.git Packages/Application/Lightwerk.SurfCaptain/
1. Define database settings in Configuration/Settings.yaml
1. Copy route from Packages/Application/Lightwerk.SurfCaptain/Configuration/Routes.yaml to Configuration/Routes.yaml
1. Set Lightwerk/SurfCaptain/git/privateToken in Configuration/Settings.yaml (see Packages/Application/Lightwerk.SurfCaptain/Configuration/Settings.yaml)
1. ./flow doctrine:update

# JSON API Calls

    # List projects
    curl http://surf.flow.lp.lw.loc/api/projects | jq '.'

    # List servers
    curl http://surf.flow.lp.lw.loc/api/servers | jq '.'
    # Add server
    curl -v -X POST http://surf.flow.lp.lw.loc/api/servers\?collectionKey\=sma\&serverKey\=fe1\&configuration\=%7B%22host%22%3A%22www.sma.de%22%2C%22username%22%3A%22user1%22%2C%22password%22%3A%22abcde%22%7D
    # Update server
    curl -v -X PUT http://surf.flow.lp.lw.loc/api/servers\?collectionKey\=sma\&serverKey\=fe1\&configuration\=%7B%22host%22%3A%22www.sma.de%22%2C%22username%22%3A%22user1%22%2C%22password%22%3A%22abcde%22%7D
    # Remove server
    curl -v -X DELETE http://surf.flow.lp.lw.loc/api/servers\?collectionKey\=sma\&serverKey\=fe1
    
    # List servers of a project
    curl http://surf.flow.lp.lw.loc/api/projectServers\?projectId\=17 | jq '.'
    # Add project to server
    curl -v -X POST http://surf.flow.lp.lw.loc/api/projectServers\?projectId\=17\&collectionKey\=sma | jq '.'
    # Remove project from server
    curl -v -X DELETE http://surf.flow.lp.lw.loc/api/projectServers\?projectId\=17\&collectionKey\=sma | jq '.'

    # List branches of a repository
    curl http://surf.flow.lp.lw.loc/api/branches\?projectId\=17 | jq '.'

    # List tags of a repository
    curl http://surf.flow.lp.lw.loc/api/tags\?projectId\=17 | jq '.'

    # List deployments of a project
    curl http://surf.flow.lp.lw.loc/api/deployments\?projectId\=17 | jq '.'
    # Create new deployments
    curl -v -X POST http://surf.flow.lp.lw.loc/api/deployments\?projectId\=17\&reference\=d428944a85a9a1cb2c1ff3b91f69f4ced559f296\&referenceName\=1.2.3\&application\=deploy\&configuration\=%7B%22server%22%3A%22sma%22%2C%22directory%22%3A%22%5C%2Fvar%5C%2Fwww%5C%2Fsma%5C%2Flive%5C%2F%22%7D
    
    # List logs of a deployment
    curl http://surf.flow.lp.lw.loc/api/logs\?deployment\=ac964cbf-9f85-c9d3-63b8-85b40414f53c | jq '.
    # List logs of a deployment with a offset (offset = sum of already loaded log entries)
    curl http://surf.flow.lp.lw.loc/api/logs\?deployment\=ac964cbf-9f85-c9d3-63b8-85b40414f53c\&offset=23 | jq '.

# GitLab API Reponses

    curl --insecure --header "PRIVATE-TOKEN: ..." https://git.lightwerk.com/api/v3/groups/10 | jq '.'
    {
      "projects": [
        {
          "namespace": {
            "avatar": {
              "url": null
            },
            "description": "",
            "updated_at": "2014-04-14T09:31:52.771Z",
            "created_at": "2014-04-14T09:31:52.771Z",
            "owner_id": null,
            "path": "project",
            "name": "project",
            "id": 10
          },
          "last_activity_at": "2014-06-18T12:33:38.548Z",
          "created_at": "2014-04-14T11:51:40.133Z",
          "snippets_enabled": false,
          "web_url": "https://git.lightwerk.com/project/gvsweb",
          "http_url_to_repo": "https://git.lightwerk.com/project/gvsweb.git",
          "ssh_url_to_repo": "git@git.lightwerk.com:project/gvsweb.git",
          "visibility_level": 0,
          "public": false,
          "default_branch": "master",
          "description": "",
          "id": 21,
          "name": "gvsweb",
          "name_with_namespace": "project / gvsweb",
          "path": "gvsweb",
          "path_with_namespace": "project/gvsweb",
          "issues_enabled": true,
          "merge_requests_enabled": true,
          "wall_enabled": false,
          "wiki_enabled": true
        },
        ...
      ],
      "owner_id": null,
      "path": "project",
      "name": "project",
      "id": 10
    }

    curl --insecure --header "PRIVATE-TOKEN: ..." https://git.lightwerk.com/api/v3/projects/17/repository/tags | jq '.'
    [
      {
        "protected": false,
        "commit": {
          "committed_date": "2013-03-26T18:16:28+01:00",
          "authored_date": "2013-03-26T18:16:28+01:00",
          "committer": {
            "email": "gt@gtweb1.nine.ch",
            "name": "gt"
          },
          "author": {
            "email": "gt@gtweb1.nine.ch",
            "name": "gt"
          },
          "message": "removed development code",
          "tree": "7db5d677c97006d3cec977c8be3bdd6fedf046fe",
          "parents": [
            {
              "id": "38a00d2880d3657d67625f2251c071ef53841851"
            }
          ],
          "id": "d428944a85a9a1cb2c1ff3b91f69f4ced559f296"
        },
        "name": "1.0.0"
      },
      ...
    ]
    
    curl --insecure --header "PRIVATE-TOKEN: ..." https://git.lightwerk.com/api/v3/projects/17/repository/branches | jq '.'
    [
      {
        "protected": false,
        "commit": {
          "committed_date": "2014-06-08T22:39:15+02:00",
          "authored_date": "2014-06-08T22:39:15+02:00",
          "committer": {
            "email": "dlg@lightwerk.com",
            "name": "Daniel Goerz"
          },
          "author": {
            "email": "dlg@lightwerk.com",
            "name": "Daniel Goerz"
          },
          "message": "[CONFIGURATION] lw_gtweb_basis - set right sys_language_uids",
          "tree": "7365c56977b99ad41fa87ac0410caf259e413c93",
          "parents": [
            {
              "id": "0beef1b75a2d33b402288aa0ee3a48d912aa75b4"
            }
          ],
          "id": "119bd7f125356c38207d2e4c6f518d868b005a35"
        },
        "name": "upgrade"
      },
      ...
    ]