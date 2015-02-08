<?php
namespace Lightwerk\SurfCaptain\GitApi\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Repository;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Error\Debugger;

/**
 * GitLab Driver
 *
 * @package Lightwerk\SurfCaptain
 */
class BitBucketDriver extends AbstractDriver {

	/**
	 * @param array $settings
	 * @return void
	 */
	public function setSettings(array $settings) {
		$this->settings = $settings;
		$this->apiRequest = $this->objectManager->get('Lightwerk\SurfCaptain\GitApi\ApiRequestInterface');
		$this->apiRequest->setApiUrl($settings['apiUrl']);
		$this->apiRequest->setFallbackApiUrl($settings['fallbackApiUrl']);
		$this->apiRequest->setOAuthClient($settings['privateToken'], $settings['privateSecret'], $settings['accessToken'], $settings['accessSecret']);
	}


	/**
	 * @param string $repositoryUrl
	 * @return boolean
	 */
	public function hasRepository($repositoryUrl) {
		return $this->getRepositoryAccount($repositoryUrl) === $this->settings['accountName'];
	}

	/**
	 * @return array
	 */
	public function getRepositories() {
		$repositories = array();
		foreach ($this->settings['repositories'] as $command) {
			$response = $this->apiRequest->call($command);
			$projects = $response['values'];
			$repositories = array_merge(
				$repositories,
				$this->dataMapper->mapToObject(
					$projects,
					'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository[]',
					!empty($this->settings['mapping']) ? $this->settings['mapping'] : array()
				)
			);
		}
		return $repositories;
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 * @throws Exception
	 */
	public function getFileContent($repositoryUrl, $filePath, $reference = 'master') {
		$name = $this->getRepositoryName($repositoryUrl);
		$name = urlencode($name);
		$command = 'repositories/' . $this->settings['accountName'] . '/' . $name . '/raw/' . $reference . '/' . $filePath;
		$response = $this->apiRequest->callFallback($command);
		return json_encode($response);
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
			'projects/' . urlencode($this->getRepositoryName($repositoryUrl)) . '/repository/files',
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
		$command = 'repositories/' . $this->settings['accountName'] . '/' . $name;
		$response = $this->apiRequest->call($command);
		$repository = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository',
			$this->settings['mapping']
		);

		// branches
		$response = $this->apiRequest->callFallback($command . '/branches');
		$branches = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Branch[]',
			$this->settings['mapping']
		);
		$repository->setBranches($branches);

		// tags
		$response = $this->apiRequest->callFallback($command . '/tags');
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
	 * @return string
	 */
	protected function getRepositoryAccount($repositoryUrl) {
		$parts = explode('/', $repositoryUrl);
		return $parts[3];
	}

	/**
	 * @param string $repositoryUrl
	 * @return string
	 */
	protected function getRepositoryName($repositoryUrl) {
		if (strpos($repositoryUrl, 'ssh') !== FALSE) {
			$parts = explode('/', $repositoryUrl);
			return str_replace('.git', '', array_pop($parts));
		}
		return parent::getRepositoryName($repositoryUrl);
	}

}
