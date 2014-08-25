<?php
namespace Lightwerk\SurfCaptain\Service\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Branch;
use Lightwerk\SurfCaptain\Domain\Model\Repository;
use Lightwerk\SurfCaptain\Domain\Model\Tag;
use Lightwerk\SurfCaptain\Mapper\DataMapper;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Response;

class GitHubDriver implements DriverInterface {

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
	 * not sure if inject is "cool" (inject only singletons?)
	 * contains bugfix
	 * @Flow\Inject
	 * @var \Lightwerk\SurfCaptain\Http\Client\CurlEngine
	 */
	protected $browserRequestEngine;

	/**
	 * @FLow\Inject
	 * @var DataMapper
	 */
	protected $dataMapper;

	/**
	 * @var array
	 */
	protected $server = array(
		'HTTP_CONTENT_TYPE' => 'application/json',
		'Accept' => 'application/json',
	);

	/**
	 * Sets the settings
	 *
	 * @param array $settings
	 * @return void
	 */
	public function setSettings(array $settings) {
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
	 * Return project id parameter from repository url
	 *
	 * @param string $repositoryUrl
	 * @return string
	 * @throws Exception
	 */
	protected function getId($repositoryUrl) {
		return urlencode(GeneralUtility::getUrlPartsFromRepositoryUrl($repositoryUrl)['path']);
	}

	/**
	 * @param string $command
	 * @param string $method
	 * @param array $parameters
	 * @return mixed $data
	 * @throws Exception
	 * @throws \TYPO3\Flow\Http\Exception
	 */
	protected function getGitHubApiResponse($command, $method = 'GET', array $parameters = array(), array $content = array()) {
		$url = $this->settings['apiUrl'] . $command . '?' . http_build_query($parameters);
		// transfer Token in http header
		$this->browserRequestEngine->setOption(CURLOPT_HTTPHEADER, array('Authorization: token ' . $this->settings['privateToken']));
		// maybe we will throw own exception to give less information (token is outputed)
		$response = $this->browser->request($url, $method, array(), array(), $this->server, json_encode($content));

		$this->emitGitLabApiCall($url, $method, $response);

		$statusCode = $response->getStatusCode();

		if ($statusCode < 200 || $statusCode >= 400) {
			throw new Exception('GitHub request was not successful. Response was: ' . $response->getStatus(), 1408987295);
		}

		$content = json_decode($response->getContent(), TRUE);
		if ($content === NULL) {
			throw new Exception('Response from GitHub is not a valid json', 1408987294);
		}
		return $content;
	}

	
	/**
	 * @param string $url
	 * @param string $method
	 * @param Response $response
	 * @return void
	 * @Flow\Signal
	 */
	protected function emitGitLabApiCall($url, $method, Response $response) {}

	/**
	 * Returns repositories
	 *
	 * @return array
	 */
	public function getRepositories() {
		$repositories = $this->getGitHubApiResponse($this->settings['repositories']);
		return $repositories;
	}

	/**
	 * Returns repository
	 *
	 * @param string $repositoryUrl
	 * @return Repository
	 */
	public function getRepository($repositoryUrl) {
		throw new \Lightwerk\SurfCaptain\Exception('not implemented', 1408989277);
	}

	/**
	 * Return the content of a file
	 *
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 */
	public function getFileContent($repositoryUrl, $filePath, $reference = 'master') {
		throw new \Lightwerk\SurfCaptain\Exception('not implemented', 1408989281);
	}

	/**
	 * Sets the content of a file
	 *
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $content
	 * @param string $commitMessage
	 * @param string $branchName
	 * @return void
	 */
	public function setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName = 'master') {
		throw new \Lightwerk\SurfCaptain\Exception('not implemented', 1408989282);
	}

	/**
	 * Returns branches of a repository
	 *
	 * @param string $repositoryUrl
	 * @return Branch[]
	 */
	public function getBranches($repositoryUrl) {
		throw new \Lightwerk\SurfCaptain\Exception('not implemented', 1408989282);
	}

	/**
	 * Returns tags of a repository
	 *
	 * @param string $repositoryUrl
	 * @return Tag[]
	 */
	public function getTags($repositoryUrl) {
		throw new \Lightwerk\SurfCaptain\Exception('not implemented', 1408989283);
	}
}
