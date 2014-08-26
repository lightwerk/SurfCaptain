<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class OfflineRequest implements ApiRequestInterface {

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
	 * @throws \TYPO3\Flow\Http\Exception
	 */
	public function call($command, $method = 'GET', array $parameters = array(), array $content = array()) {
		$directory = FLOW_PATH_DATA . 'SurfCaptainRequests';
		if ($method !== 'GET') {
			throw new Exception('only GET implemented', 1111);
			file_put_contents($directory . '/' . urlencode($url), $response->getContent());
		}
		$file = $directory . '/' . urlencode($url);
		if (file_exists($file) === FALSE) {
			throw new Exception('file not exists ' . $file, 1111);
		}
		$content = file_get_contents($file);

		$content = json_decode($content, TRUE);
		if ($content === NULL) {
			throw new Exception('cannot decode content to json', 1111);
		}
		return $content;
	}

}
