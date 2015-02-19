<?php
namespace Lightwerk\SurfCaptain\GitApi\Request;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class OfflineRequest implements HttpAuthRequestInterface {

	/**
	 * @var string
	 */
	protected $apiUrl;

	/**
	 * @param array $headers 
	 * @return void
	 */
	public function setAuthorizationHeader(array $headers) {
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
	 */
	public function call($command, $method = 'GET', array $parameters = array(), array $content = array()) {
		$directory = FLOW_PATH_DATA . 'SurfCaptainRequests';
		$url = $this->apiUrl . $command . '?' . http_build_query($parameters);
		$file = $directory . '/' . $method . '_' . urlencode($url);
		if (file_exists($file) === FALSE) {
			throw new Exception('file not exists ' . $file, 1409929475);
		}
		$content = file_get_contents($file);

		$content = json_decode($content, TRUE);
		if ($content === NULL) {
			throw new Exception('cannot decode content to json', 1409929476);
		}
		return $content;
	}

}
