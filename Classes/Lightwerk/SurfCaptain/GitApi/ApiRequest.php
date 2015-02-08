<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

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
	 * @var string
	 */
	protected $fallbackApiUrl;

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
	 * @param string $fallbackApiUrl
	 * @return void
	 */
	public function setFallbackApiUrl($fallbackApiUrl) {
		$this->fallbackApiUrl = $fallbackApiUrl;
	}

	/**
	 * @param string $command
	 * @param string $method
	 * @param array $parameters
	 * @param array $content
	 * @return mixed $data
	 * @throws Exception
	 * @throws \TYPO3\Flow\Http\Exception
	 */
	public function call($command, $method = 'GET', array $parameters = array(), array $content = array()) {
		$url = $this->apiUrl . $command . '?' . http_build_query($parameters);
		$this->emitBeforeApiCall($url, $method);
		// maybe we will throw own exception to give less information (token is outputed)
		$response = $this->browser->request($url, $method, array(), array(), $this->server, json_encode($content));

		$this->emitApiCall($url, $method, $response);

		$statusCode = $response->getStatusCode();

		if ($statusCode < 200 || $statusCode >= 400) {
			throw new Exception('ApiRequest was not successful for command  ' . $command . ' Response was: ' . $response->getStatus(), 1408987295);
		}

		$content = json_decode($response->getContent(), TRUE);
		if ($content === NULL) {
			throw new Exception('Response from ApiRequest is not a valid json', 1408987294);
		}
		return $content;
	}

	/**
	 * @param string $command
	 * @param string $method
	 * @param array $parameters
	 * @param array $content
	 * @return mixed $data
	 * @throws Exception
	 * @throws \TYPO3\Flow\Http\Exception
	 */
	public function callFallback($command, $method = 'GET', array $parameters = array(), array $content = array()) {
		if (empty($this->fallbackApiUrl)) {
			throw new Exception('No Fallback API Url was configured.', 1408987296);
		}
		$apiUrl = $this->apiUrl;
		$this->setApiUrl($this->fallbackApiUrl);
		$contentToReturn = $this->call($command, $method, $parameters, $content);
		$this->setApiUrl($apiUrl);
		return $contentToReturn;
	}

	/**
	 * @param string $url
	 * @param string $method
	 * @param mixed $response
	 * @return void
	 * @Flow\Signal
	 */
	protected function emitApiCall($url, $method, $response) {}

	/**
	 * @param string $url
	 * @param string $method
	 * @return void
	 * @Flow\Signal
	 */
	protected function emitBeforeApiCall($url, $method) {}
}
