<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Response;

/**
 * @Flow\Scope("singleton")
 */
class RequestListener {

	/**
	 * @throws \Lightwerk\SurfCaptain\Exception
	 * @return string
	 */
	protected function getDataDirectory() {
		$directory = FLOW_PATH_DATA . 'SurfCaptainRequests';
		if (is_dir($directory) === FALSE) {
			if (@mkdir($directory) === FALSE) {
				throw new \Lightwerk\SurfCaptain\Exception('cannot create directory ' . $directory, 1408873802);
			}
		}
		return $directory;
	}

	/**
	 * @return string
	 */
	protected function getLogDirectory() {
		return FLOW_PATH_DATA . 'Logs';
	}

	/**
	 * @param string $url 
	 * @param string $method 
	 * @param Response $response 
	 * @throws \Lightwerk\SurfCaptain\Exception
	 * @return void
	 */
	public function saveApiCall($url, $method, Response $response) {
		$directory = $this->getDataDirectory();
		if ($method === 'GET') {
			file_put_contents($directory . '/' . urlencode($url), $response->getContent());
		}
	}

	/**
	 * @param string $url 
	 * @param string $method 
	 * @param Response $response 
	 * @return void
	 */
	public function logApiCall($url, $method, Response $response) {
		$directory = $this->getLogDirectory();
		file_put_contents($directory . '/SurfCaptain_Request.log', $method . '_' . $url . "\n", FILE_APPEND);
		file_put_contents($directory . '/SurfCaptain_Request.log', $response->getContent() . "\n", FILE_APPEND);
	}

}
