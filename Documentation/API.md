# API

## Repositories

### List Repositories

- Method: GET
- Path: /api/repository

Example call:

    curl -H "Accept: application/json" http://surfcaptain.loc/api/repository | jq '.'

### Show Repository

- Method: GET
- Path: /api/repository
- Parameters:
	- repositoryUrl (required) - string
- Info: Contains git tags, git branches and presets of a repository

Example call:

    curl -H "Accept: application/json" http://surfcaptain.loc/api/repository\?repositoryUrl\=git%40git.example.de%3Aexample-websites%2Frcw-example-de.git | jq '.'

## Deployments

### List deployments

- Method: GET
- Path: /api/deployment
- Parameters:
	- limit - integer (Default: 100)

Example call to get the deployments of all repositories:

	curl -H "Accept: application/json" http://surfcaptain.loc/api/deployment | jq '.'

### Show deployment

- Method: GET
- Path: /api/deployment
- Parameters:
	- deployment (required) - string
- Info: Contains all logs of the deployment

Example call:

	curl -H "Accept: application/json" http://surfcaptain.loc/api/deployment | jq '.'

### Create new deployment

- Method: POST
- Path: /api/deployment
- Parameters:
	- deployment (required) - json

Example call with a configuration:

	curl -H "Accept: application/json" -H "Content-Type: application/json" -v -X POST http://surfcaptain.loc/api/deployment -d '{
		"deployment": {
			"configuration": {
				"applications": [
					{
						"type": "TYPO3\\CMS\\Deploy",
						"options": {
							"repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
							"deploymentPath": "/var/www/projectName/context/",
							"context": "Development",
							"tag": "1.2.3"
						},
						"nodes": [
							{
								"name": "Front-End Server 2",
								"hostname": "www2.example.de",
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
- Method: PUT
- Path: /api/deployment
- Parameters:
	- deployment (required) - json

Example call:

	curl -H "Accept: application/json" -H "Content-Type: application/json" -v -X PUT http://surfcaptain.loc/api/deployment -d '{
		"deployment": {
			"__identity": "de45df59-c62f-0367-8a27-8e6899e3673d",
			"status": "cancelled"
		}
	}'

## Frontend Settings

### List settings

- Method: GET
- Path: /api/frontendsetting

Example call to list presets of a defined project:

	curl -H "Accept: application/json" http://surfcaptain.loc/api/frontendsetting | jq '.'

## Presets

### List presets

- Method: GET
- Path: /api/preset
- Parameters:
	- global - boolean
- Info: To list presets of a repository, please use the Repository-API (Show)

Example call to list all presets:

	curl -H "Accept: application/json" http://surfcaptain.loc/api/preset | jq '.'

Example call to list all global presets:

	curl -H "Accept: application/json" http://surfcaptain.loc/api/preset\?global\=1 | jq '.'

### Add presets

- Method: POST
- Path: /api/preset
- Parameters:
	- key (required) - string
	- configuration (required) - json

Example call:

	curl -H "Accept: application/json" -H "Content-Type: application/json" -v -X POST http://surfcaptain.loc/api/preset -d '{
		"key": "example",
		"configuration": {
			"applications": [
				{
					"options": {
						"repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
						"deploymentPath": "/var/www/projectName/context/",
						"context": "Development"
					},
					"nodes": [
						{
							"name": "Front-End Server 2",
							"hostname": "www2.example.de",
							"username": "user2"
						}
					]
				}
			]
		}
	}'

### Update presets

- Method: PUT
- Path: /api/preset
- Parameters:
	- key (required) - string
	- configuration (required) - json
- Info: To rename a key, please delete the old preset and add a new one

Example call:

	curl -H "Accept: application/json" -H "Content-Type: application/json" -v -X PUT http://surfcaptain.loc/api/preset -d '{
		"key": "example.com",
		"configuration": {
			"applications": [
				{
					"options": {
						"repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
						"deploymentPath": "/var/www/projectName/context/",
						"context": "Development"
					},
					"nodes": [
						{
							"name": "Front-End Server 2",
							"hostname": "example.com",
							"username": "user2"
						}
					]
				}
			]
		}
	}'

### Delete preset

- Method: DELETE
- Path: /api/preset
- Parameters:
	- key (required) - string

Example call:

	curl -H "Accept: application/json" -v -X DELETE http://surfcaptain.loc/api/preset\?key\=example

### Check SSH login

- Method: GET
- Path: /api/checkSshLogin
- Parameters:
	- hostname (required) - string
	- username - string
	- port - integer

Example call:

	curl -H "Accept: application/json" http://surfcaptain.loc/api/checkSshLogin\?hostname\=dev.loc\&username\=lw-lm | jq '.'