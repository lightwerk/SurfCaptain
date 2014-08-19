# API

## Repositories

### List Repositories

- Methode: GET
- Path: /api/repository

Example call:

    curl -H "Accept: application/json" http://surf.flow.lp.lw.loc/api/repositories | jq '.'

### Show Repository

- Methode: GET
- Path: /api/repository
- Parameters:
	- repositoryUrl (required) - string
- Info: Contains git tags, git branches and presets of a repository

Example call:

    curl -H "Accept: application/json" http://surf.flow.lp.lw.loc/api/repository\?repositoryUrl\=git%40git.lightwerk.com%3Aboilerplate%2Ftypo3_cms.git | jq '.'

## Deployments

### List deployments

- Methode: GET
- Path: /api/deployment

Example call to get the deployments of all repositories:

	curl -H "Accept: application/json" http://surf.flow.lp.lw.loc/api/deployment | jq '.'

### Show deployment

- Methode: GET
- Path: /api/deployment
- Parameters:
	- deployment (required) - string
- Info: Contains all logs of the deployment

Example call:

	curl -H "Accept: application/json" http://surf.flow.lp.lw.loc/api/deployment | jq '.'

### Create new deployment

- Methode: POST
- Path: /api/deployment
- Parameters:
	- deployment (required) - json

Example call with a configuration:

	curl -H "Accept: application/json" -H "Content-Type: application/json" -v -X POST http://surf.flow.lp.lw.loc/api/deployment -d '{
		"deployment": {
			"configuration": {
				"applications": [
					{
						"type": "TYPO3\\CMS\\Deploy",
						"options": {
							"repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
							"documentRoot": "/var/www/projectName/context/",
							"context": "Development",
							"tag": "1.2.3"
						},
						"nodes": [
							{
								"name": "Front-End Server 2",
								"hostname": "www2.sma.de",
								"username": "user2"
							}
						]
					}
				]
			}
		}
	}'

### Cancel a deployment

- Info: Works just if it has still "waiting" as status
- Methode: PUT
- Path: /api/deployment
- Parameters:
	- deployment (required) - json

Example call:

	curl -H "Accept: application/json" -H "Content-Type: application/json" -v -X PUT http://surf.flow.lp.lw.loc/api/deployment -d '{
		"deployment": {
			"__identity": "de45df59-c62f-0367-8a27-8e6899e3673d",
			"status": "cancelled"
		}
	}'

## Frontend Settings

### List settings

- Methode: GET
- Path: /api/frontendsetting

Example call to list presets of a defined project:

	curl -H "Accept: application/json" http://surf.flow.lp.lw.loc/api/frontendsetting | jq '.'

## Presets

### List presets

- Methode: GET
- Path: /api/preset
- Parameters:
	- global - boolean
- Info: To list presets of a repository, please use the Repository-API (Show)

Example call to list all presets:

	curl -H "Accept: application/json" http://surf.flow.lp.lw.loc/api/preset | jq '.'

Example call to list all global presets:

	curl -H "Accept: application/json" http://surf.flow.lp.lw.loc/api/preset\?global\=1 | jq '.'

### Add presets

- Methode: POST
- Path: /api/preset
- Parameters:
	- key (required) - string
	- configuration (required) - json

Example call:

	curl -H "Accept: application/json" -v -X POST http://surf.flow.lp.lw.loc/api/preset\?key=sma\&configuration\=%7B%22applications%22%3A%5B%7B%22options%22%3A%7B%22repositoryUrl%22%3A%22git%40git.lightwerk.com%3Aboilerplate%5C%2Ftypo3_cms.git%22%2C%22documentRoot%22%3A%22%5C%2Fvar%5C%2Fwww%5C%2FprojectName%5C%2Fcontext%5C%2F%22%2C%22context%22%3A%22Development%22%7D%2C%22nodes%22%3A%5B%7B%22name%22%3A%22Front-End+Server+2%22%2C%22hostname%22%3A%22www2.sma.de%22%2C%22username%22%3A%22user2%22%7D%5D%7D%5D%7D

Example of a decoded configuration parameter:

	{
		"applications": [
			{
				"options": {
					"repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
					"documentRoot": "/var/www/projectName/context/",
					"context": "Development"
				},
				"nodes": [
					{
						"name": "Front-End Server 2",
						"hostname": "www2.sma.de",
						"username": "user2"
					}
				]
			}
		]
	}

### Update presets

- Methode: PUT
- Path: /api/preset
- Parameters:
	- key (required) - string
	- configuration (required) - json
- Info: To rename a key, please delete the old preset and add a new one

Example call:

	curl -H "Accept: application/json" -v -X PUT http://surf.flow.lp.lw.loc/api/preset\?key=sma\&configuration\=%7B%22applications%22%3A%5B%7B%22options%22%3A%7B%22repositoryUrl%22%3A%22git%40git.lightwerk.com%3Aboilerplate%5C%2Ftypo3_cms.git%22%2C%22documentRoot%22%3A%22%5C%2Fvar%5C%2Fwww%5C%2FprojectName%5C%2Fcontext%5C%2F%22%2C%22context%22%3A%22Development%22%7D%2C%22nodes%22%3A%5B%7B%22name%22%3A%22Front-End+Server+2%22%2C%22hostname%22%3A%22www2.sma.de%22%2C%22username%22%3A%22user2%22%7D%5D%7D%5D%7D

### Delete preset

- Methode: DELETE
- Path: /api/preset
- Parameters:
	- key (required) - string

Example call:

	curl -H "Accept: application/json" -v -X DELETE http://surf.flow.lp.lw.loc/api/preset\?key\=sma