<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Response;

class ApiRequest implements ApiRequestInterface {

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
	 * @var array
	 */
	protected $server = array(
		'HTTP_CONTENT_TYPE' => 'application/json',
		'Accept' => 'application/json',
	);

	/**
	 * @var string
	 */
	protected $apiUrl;

	/**
	 * @return void
	 */
	public function initializeObject() {
		$this->browserRequestEngine->setOption(CURLOPT_SSL_VERIFYPEER, FALSE);
		$this->browserRequestEngine->setOption(CURLOPT_SSL_VERIFYHOST, FALSE);
		$this->browser->setRequestEngine($this->browserRequestEngine);
	}

	/**
	 * @param array $headers 
	 * @return void
	 */
	public function setAuthorizationHeader(array $headers) {
		$this->browserRequestEngine->setOption(CURLOPT_HTTPHEADER, $headers);
	}

	/**
	 * @param string $apiUrl 
	 * @return void
	 */
	public function setApiUrl($apiUrl) {
		$this->apiUrl = $apiUrl;
	}

	/**
	 * @param string $command
	 * @param string $method
	 * @param array $parameters
	 * @return mixed $data
	 * @throws Exception
	 * @throws \TYPO3\Flow\Http\Exception
	 */
	public function call($command, $method = 'GET', array $parameters = array(), array $content = array()) {
		$url = $this->apiUrl . $command . '?' . http_build_query($parameters);
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
}
