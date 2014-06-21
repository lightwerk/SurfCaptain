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
	 * @param $groupId
	 * @return \TYPO3\Flow\Http\Response
	 */
	public function getProjectsOfGroup($groupId) {
		return $this->getGitLabApiResponse('groups/' . $groupId);
	}

	/**
	 * @param $command
	 * @return \TYPO3\Flow\Http\Response
	 * @throws \TYPO3\Flow\Http\Client\InfiniteRedirectionException
	 */
	protected function getGitLabApiResponse($command) {
		$response = $this->browser->request(
			$this->settings['git']['url'] . $command . '?private_token=' . $this->settings['git']['privateToken']
		);
		return json_decode($response->getContent(), TRUE);
	}
}