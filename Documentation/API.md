# API

## Projects

### List Projects

- Methode: GET
- Path: /api/projects

Example call:

    curl http://surf.flow.lp.lw.loc/api/projects | jq '.'

## Nodes

### List Nodes

- Methode: GET
- Path: /api/nodes
- Optional Parameters:
	- projectId: integer (List nodes of a project)

Example call:

    curl http://surf.flow.lp.lw.loc/api/nodes | jq '.'
    curl http://surf.flow.lp.lw.loc/api/nodes\?projectId\=17 | jq '.'

### Add Node

- Methode: POST
- Path: /api/nodes
- Required Parameters:
	- nodeKey: string
	- projectId: integer or string ('*')
	- configuration: json

Example call:

    curl -v -X POST http://surf.flow.lp.lw.loc/api/nodes\?nodeKey\=fe1\&projectId\=17\&configuration\=%7B%22host%22%3A%22www.sma.de%22%2C%22username%22%3A%22user1%22%2C%22password%22%3A%22abcde%22%7D
    
Example of a decoded configuration parameter:

    {
        "name": "Front-End Server 2",
        "hostname": "www2.sma.de",
        "username": "user2",
        "context": "Development"
    }

### Update node

- Methode: PUT
- Path: /api/nodes
- Required Parameters:
	- nodeKey: string
- Optional Parameters:
	- projectId: integer or string ('*') (Adds node to a project)
	- newNodeKey: string
	- configuration: json (["Add Node"](#markdown-header-add-node))

Example call:

    curl -v -X PUT http://surf.flow.lp.lw.loc/api/nodes\?nodeKey\=fe1\&configuration\=%7B%22host%22%3A%22www.sma.de%22%2C%22username%22%3A%22user1%22%2C%22password%22%3A%22abcde%22%7D
    curl -v -X PUT http://surf.flow.lp.lw.loc/api/nodes\?nodeKey\=fe1\&newNodeKey\=fe1b\&projectId\=17

### Remove node from project

- Methode: DELETE
- Path: /api/nodes
- Required Parameters:
	- nodeKey: string
	- projectId: integer or string ('*') (Removes node from a project. Full Node gets deleted when no projectIds are given)

Example call:

    curl -v -X DELETE http://surf.flow.lp.lw.loc/api/nodes\?nodeKey\=fe1

## Branches & Tags

### List branches of a repository

- Methode: GET
- Path: /api/branches
- Required Parameters:
	- projectId: integer

Example call:

    curl http://surf.flow.lp.lw.loc/api/branches\?projectId\=17 | jq '.'

### List tags of a repository

- Methode: GET
- Path: /api/tags
- Required Parameters:
	- projectId: integer

Example call:

    curl http://surf.flow.lp.lw.loc/api/tags\?projectId\=17 | jq '.'

## Deployments

### List deployments of a project

- Methode: GET
- Path: /api/deployments
- Required Parameters:
	- projectId: integer

Example call:

    curl http://surf.flow.lp.lw.loc/api/deployments\?projectId\=17 | jq '.'

### Create new deployment

- Methode: POST
- Path: /api/deployments
- Required Parameters:
	- configuration: json
- Optional Parameters:
	- projectId: integer
	- name: string

Example call:

    curl -v -X POST http://surf.flow.lp.lw.loc/api/deployments\?projectId\=17\&name\=1.2.3\&configuration\=%7B%22applications%22%3A%7B%22deploy-HierKannStehenWasWill%22%3A%7B%22type%22%3A%22TYPO3%5C%5CCMS%5C%5CDeploy%22%2C%22options%22%3A%7B%22documentRoot%22%3A%22%5C%2Fvar%5C%2Fwww%5C%2FprojectName%5C%2Fcontext%5C%2F%22%2C%22repositoryUrl%22%3A%22git%40git.lightwerk.com%3Aboilerplate%5C%2Ftypo3_cms.git%22%2C%22sha1%22%3A%22e64eaffd0d76a9e2a924bb0263e733c660a97ecf%22%7D%2C%22nodes%22%3A%5B%7B%22name%22%3A%22Front-End+Server+2%22%2C%22hostname%22%3A%22www2.sma.de%22%2C%22username%22%3A%22user2%22%2C%22context%22%3A%22Development%22%7D%5D%7D%7D%7D

Example of a decode configuration parameter:

    {
        "applications": {
            "deploy-HierKannStehenWasWill": {
                "type": "TYPO3\\\CMS\\\Deploy",
                "options": {
                    "documentRoot": "/var/www/projectName/context/",
                    "repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
                    "sha1": "e64eaffd0d76a9e2a924bb0263e733c660a97ecf"
                },
                "nodes": [
                    {
                        "name": "Front-End Server 2",
                        "hostname": "www2.sma.de",
                        "username": "user2",
                        "context": "Development"
                    }
                ]
            }
        }
    }

### Cancel a deployment

- Info: Works just if it has still "waiting" as status
- Methode: DELETE
- Path: /api/deployments
- Required Parameters:
	- deployment: string

Example call:

    curl -v -X DELETE http://surf.flow.lp.lw.loc/api/deployments\?deployment\=ac964cbf-9f85-c9d3-63b8-85b40414f53c

## Logs

### List logs of a deployment

- Methode: GET
- Path: /api/logs
- Required Parameters:
	- deployment: string
- Optional Parameters:
	- offset: integer (sum of already loaded log entries (to load them not again))

Example call:

    curl http://surf.flow.lp.lw.loc/api/logs\?deployment\=ac964cbf-9f85-c9d3-63b8-85b40414f53c | jq '.'
    curl http://surf.flow.lp.lw.loc/api/logs\?deployment\=ac964cbf-9f85-c9d3-63b8-85b40414f53c\&offset=23 | jq '.'

## Presets

### List presets of a project

- Methode: GET
- Path: /api/presets
- Required Parameters:
	- projectId: integer

Example call:

    curl http://surf.flow.lp.lw.loc/api/presets\?projectId\=17 | jq '.'