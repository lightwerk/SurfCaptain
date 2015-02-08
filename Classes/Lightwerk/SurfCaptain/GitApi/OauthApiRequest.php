<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Response;

class OauthApiRequest extends ApiRequest {

	/**
	 * @var \OAuth
	 */
	protected $oAuthClient;

	/**
	 * @param string $consumerKey
	 * @param string $consumerSecret
	 * @param string $accessToken
	 * @param string$accessSecret
	 * @return void
	 */
	public function setOAuthClient($consumerKey, $consumerSecret, $accessToken, $accessSecret) {
		$this->oAuthClient = new \OAuth($consumerKey, $consumerSecret);
		$this->oAuthClient->setToken($accessToken, $accessSecret);
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
		if (empty($this->oAuthClient)) {
			return parent::call($command, $method, $parameters, $content);
		}
		$url = $this->apiUrl . $command;
		$this->emitBeforeApiCall($url, $method);
		// maybe we will throw own exception to give less information (token is outputed)
		$this->oAuthClient->fetch($url, $parameters, $method);
		$responseInfo = $this->oAuthClient->getLastResponseInfo();
		$response = $this->oAuthClient->getLastResponse();

		$this->emitApiCall($url, $method, $response);

		$statusCode = $responseInfo['http_code'];

		if ($statusCode < 200 || $statusCode >= 400) {
			throw new Exception('ApiRequest was not successful for command  ' . $command . ' Response was: ' . $statusCode, 1408987295);
		}
		$content = json_decode($response, TRUE);
		if ($content === NULL) {
			throw new Exception('Response from ApiRequest is not a valid json', 1408987294);
		}
		return $content;
	}

	/**
	 * @param string $url
	 * @param string $method
	 * @param mixed $response
	 * @return void
	 * @Flow\Signal
	 */
	protected function emitApiCall($url, $method, $response) {}
}
