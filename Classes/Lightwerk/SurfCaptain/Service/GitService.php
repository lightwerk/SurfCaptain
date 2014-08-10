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
	 * @var \TYPO3\Flow\Http\Response
	 */
	protected $lastResponse;

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
		$this->browserRequestEngine->setOption(CURLOPT_SSL_VERIFYHOST, FALSE);
		$this->browser->setRequestEngine($this->browserRequestEngine);
	}

	/**
	 * @param string $command
	 * @param string $method
	 * @param array $parameters
	 * @return array $json
	 * @throws GitServiceException
	 * @throws TYPO3\Flow\Http\Exception
	 */
	protected function getGitLabApiResponse($command, $method = 'GET', array $parameters = array()) {
		$parameters['private_token'] = $this->settings['git']['privateToken'];
		$url = $this->settings['git']['url'] . $command . '?' . http_build_query($parameters);
		// maybe we will throw own exception to give less information (token is outputed)
		$response = $this->browser->request($url, $method);
		$json = json_decode(
			$response->getContent(),
			TRUE
		);
		if ($json === NULL) {
			throw new GitServiceException('response cannot decode to json', 1406818561);
		}
		return $json;
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
			$this->getGitLabApiResponse(
				'projects/' . $projectId . '/repository/files',
				'GET',
				array(
					'file_path' => $filePath,
					'ref' => $ref,
				)
			)['content']
		);
	}

	/**
	 * @param integer $projectId
	 * @param string $filePath
	 * @param string $content
	 * @param string $commitMessage
	 * @param string $branchName
	 * @return void
	 */
	public function setFileContent($projectId, $filePath, $content, $commitMessage, $branchName = 'master') {
		$this->getGitLabApiResponse(
			'projects/' . $projectId . '/repository/files',
			'PUT',
			array(
				'file_path' => $filePath,
				'branch_name' => $branchName,
				'commit_message' => $commitMessage,
				'content' => $content
			)
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
