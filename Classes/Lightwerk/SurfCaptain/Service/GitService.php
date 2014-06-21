<?php
namespace Lightwerk\SurfCaptain\Service;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class GitService {

	/**
	 * @var array
	 */
	protected $settings;

	/**
	 * @Flow\Inject
	 * @var \TYPO3\Flow\Http\Client\Browser
	 */
	protected $browser;

	/**
	 * @Flow\Inject
	 * @var \TYPO3\Flow\Http\Client\CurlEngine
	 */
	protected $browserRequestEngine;

	/**
	 * Inject the settings
	 *
	 * @param array $settings
	 * @return void
	 */
	public function injectSettings(array $settings) {
		$this->settings = $settings;
	}

	/**
	 * @return void
	 */
	public function initializeObject() {
		$this->browserRequestEngine->setOption(CURLOPT_SSL_VERIFYPEER, FALSE);
		$this->browser->setRequestEngine($this->browserRequestEngine);
	}

	/**
	 * @param $command
	 * @return \TYPO3\Flow\Http\Response
	 * @throws \TYPO3\Flow\Http\Client\InfiniteRedirectionException
	 */
	protected function getGitLabApiResponse($command, $method = 'GET', array $arguments = array(), array $files = array(), array $server = array(), $content = NULL) {
		return json_decode(
			$this->browser->request(
				$this->settings['git']['url'] . $command . (strpos($command, '?') ? '&' : '?') . 'private_token=' . $this->settings['git']['privateToken'],
				$method,
				$arguments,
				$files,
				$server,
				$content
			)->getContent(),
			TRUE
		);
	}

	/**
	 * @param integer $groupId
	 * @return \TYPO3\Flow\Http\Response
	 */
	public function getProjectsOfGroup($groupId) {
		return $this->getGitLabApiResponse('groups/' . $groupId);
	}

	/**
	 * @param integer $projectId
	 * @param string $filePath
	 * @param string $ref
	 * @return string
	 */
	public function getFileContent($projectId, $filePath, $ref = 'master') {
		return base64_decode(
			$this->getGitLabApiResponse('projects/' . $projectId . '/repository/files?file_path=' . $filePath . '&ref=' . $ref)['content']
		);
	}

	/**
	 * @param $projectId
	 * @return \TYPO3\Flow\Http\Response
	 */
	public function getBranches($projectId) {
		return $this->getGitLabApiResponse('/projects/' . $projectId . '/repository/branches');
	}

	/**
	 * @param $projectId
	 * @return \TYPO3\Flow\Http\Response
	 */
	public function getTags($projectId) {
		return $this->getGitLabApiResponse('/projects/' . $projectId . '/repository/tags');
	}
}