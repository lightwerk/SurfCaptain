<?php
namespace Lightwerk\SurfCaptain\GitApi\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class GitHubDriver extends AbstractDriver {

	/**
	 * @param array $settings
	 * @return void
	 */
	public function setSettings(array $settings) {
		$this->settings = $settings;
		$this->apiRequest = $this->objectManager->get('Lightwerk\SurfCaptain\GitApi\ApiRequestInterface');
		$this->apiRequest->setApiUrl($settings['apiUrl']);
		$this->apiRequest->setAuthorizationHeader(array('Authorization: token ' . $settings['privateToken']));
	}

	/**
	 * @param string $repositoryUrl
	 * @return boolean
	 */
	public function hasRepository($repositoryUrl) {
		if ($this->getRepositoryAccount($repositoryUrl) === $this->settings['accountName']) {
			return TRUE;
		}
		return FALSE;
	}

	/**
	 * @return array
	 */
	public function getRepositories() {
		$repositories = array();
		foreach ($this->settings['repositories'] as $name => $command) {
			$response = $this->apiRequest->call($command);
			if (isset($response['id']) === TRUE) {
				$response = array($response);
			}
			$repositories = array_merge($repositories, $this->dataMapper->mapToObject(
				$response,
				'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository[]',
				$this->settings['mapping']
			));
		}
		return $repositories;
	}

	/**
	 * @param string $repositoryUrl
	 * @return Repository
	 */
	public function getRepository($repositoryUrl) {
		$name = $this->getRepositoryName($repositoryUrl);
		$command = 'repos/' . $name;
		$response = $this->apiRequest->call($command);
		$repository = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository',
			$this->settings['mapping']
		);
		// branches
		$response = $this->apiRequest->call($command . '/branches');
		$branches = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Branch[]',
			$this->settings['mapping']
		);
		$repository->setBranches($branches);
		// tags
		$response = $this->apiRequest->call($command . '/tags');
		$tags = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Tag[]',
			$this->settings['mapping']
		);
		$repository->setTags($tags);
		return $repository;
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 */
	public function getFileContent($repositoryUrl, $filePath, $reference = 'master') {
		$command = 'repos/' . $this->getRepositoryName($repositoryUrl) . '/contents/' . $filePath;
		$response = $this->apiRequest->call($command, 'GET', array('ref' => $reference));
		// TODO build file object (to get sha)
		switch ($response['encoding']) {
			case 'base64':
				$content = base64_decode($response['content']);
				break;
			default:
				throw new Exception('Encoding "' . $response['encoding'] . '" is unknown!', 1407793800);
		}
		return $content;
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 */
	public function getFile($repositoryUrl, $filePath, $reference = 'master') {
		$command = 'repos/' . $this->getRepositoryName($repositoryUrl) . '/contents/' . $filePath;
		$response = $this->apiRequest->call($command, 'GET', array('ref' => $reference));
		// TODO build file object (to get sha)
		return $response;
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $content
	 * @param string $commitMessage
	 * @param string $branchName
	 * @return void
	 */
	public function setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName = 'master') {
		$command = 'repos/' . $this->getRepositoryName($repositoryUrl) . '/contents/' . $filePath;
		// TODO
		$file = $this->getFile($repositoryUrl, $filePath, $branchName);
		$sha = $file['sha'];
		$this->apiRequest->call(
			$command,
			'PUT',
			array(),
			array(
				'path' => $filePath,
				'sha' => $sha,
				'branch' => $branchName,
				'message' => $commitMessage,
				'content' => base64_encode($content)
			)
		);
	}

}
