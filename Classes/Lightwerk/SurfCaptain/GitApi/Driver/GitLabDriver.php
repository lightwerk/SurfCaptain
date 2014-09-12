<?php
namespace Lightwerk\SurfCaptain\GitApi\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class GitLabDriver extends AbstractDriver {

	/**
	 * @param array $settings
	 * @return void
	 */
	public function setSettings(array $settings) {
		$this->settings = $settings;
		$this->apiRequest = $this->objectManager->get('Lightwerk\SurfCaptain\GitApi\ApiRequestInterface');
		$this->apiRequest->setApiUrl($settings['apiUrl']);
		$this->apiRequest->setAuthorizationHeader(array('PRIVATE-TOKEN: ' . $this->settings['privateToken']));
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
		// TODO for "old" configuration
		unset($this->settings['repositories']['_projectFilter']);
		unset($this->settings['repositories']['_rcwSmaDeFilter']);

		$repositories = array();
		foreach ($this->settings['repositories'] as $name => $command) {
			$response = $this->apiRequest->call($command);
			if (isset($response['projects']) === FALSE) {
				$projects = array($response);
			} else {
				$projects = $response['projects'];
			}
			$repositories = array_merge($repositories, $this->dataMapper->mapToObject(
				$projects,
				'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository[]',
				$this->settings['mapping']
			));
		}
		return $repositories;
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 */
	public function getFileContent($repositoryUrl, $filePath, $reference = 'master') {
		$response = $this->apiRequest->call(
			'projects/' . $this->getRepositoryName($repositoryUrl) . '/repository/files',
			'GET',
			array(
				'file_path' => $filePath,
				'ref' => $reference,
			)
		);
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
	 * @param string $content
	 * @param string $commitMessage
	 * @param string $branchName
	 * @return void
	 */
	public function setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName = 'master') {
		$this->apiRequest->call(
			'projects/' . $this->getName($repositoryUrl) . '/repository/files',
			'PUT',
			array(),
			array(
				'file_path' => $filePath,
				'branch_name' => $branchName,
				'commit_message' => $commitMessage,
				'content' => $content
			)
		);
	}


	/**
	 * @param string $repositoryUrl
	 * @return Repository
	 */
	public function getRepository($repositoryUrl) {
		$name = $this->getRepositoryName($repositoryUrl);
		$name = urlencode($name);
		$command = 'projects/' . $name;
		$response = $this->apiRequest->call($command);
		$repository = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository',
			$this->settings['mapping']
		);
		// branches
		$response = $this->apiRequest->call($command . '/repository/branches');
		$branches = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Branch[]',
			$this->settings['mapping']
		);
		$repository->setBranches($branches);
		// tags
		$response = $this->apiRequest->call($command . '/repository/tags');
		$tags = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Tag[]',
			$this->settings['mapping']
		);
		$repository->setTags($tags);
		return $repository;
	}

}
