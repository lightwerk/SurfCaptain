<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Interface OAuthRequestInterface
 *
 * @author Daniel Goerz <dlg@lightwerk.com>
 */
interface OAuthRequestInterface {

	/**
	 * @param string $consumerKey
	 * @param string $consumerSecret
	 * @param string $accessToken
	 * @param string$accessSecret
	 * @return void
	 */
	public function setOAuthClient($consumerKey, $consumerSecret, $accessToken, $accessSecret);

	/**
	 * @param string $apiUrl 
	 * @return void
	 */
	public function setApiUrl($apiUrl);

	/**
	 * @param string $command
	 * @param string $method
	 * @param array $parameters
	 * @param array $content
	 * @return mixed $data
	 * @throws Exception
	 * @throws \TYPO3\Flow\Http\Exception
	 */
	public function call($command, $method = 'GET', array $parameters = array(), array $content = array());
}
