<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

abstract class BrowserCommandController extends \TYPO3\Flow\Cli\CommandController {

	/**
	 * @var array
	 */
	protected $urls = array();

	/**
	 * @var \TYPO3\Flow\Object\ObjectManagerInterface
	 * @Flow\Inject
	 */
	protected $objectManager;

	/**
	 * @var array
	 */
	protected $settings;

	/**
	 * @param array $settings
	 * @return void
	 */
	public function injectSettings($settings) {
		$this->settings = $settings;
	}

	/**
	 * @return void
	 */
	protected function getBrowser() {
		$browser = $this->objectManager->get('TYPO3\Flow\Http\Client\Browser');
		$engine = $this->objectManager->get('Lightwerk\SurfCaptain\Http\Client\CurlEngine');
		$engine->setOption(CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
		$engine->setOption(CURLOPT_SSL_VERIFYPEER, FALSE);
		$engine->setOption(CURLOPT_SSL_VERIFYHOST, FALSE);
		$browser->setRequestEngine($engine);
		return $browser;
	}

	/**
	 * callCommand 
	 *
	 * @param integer $command
	 * @return void
	 */
	public function callCommand($command = 0) {
		if ($command === 0) {
			return $this->helpCommand();
		} elseif (isset($this->urls[$command - 1]) === FALSE) {
			$this->outputLine('unknown command number ' . $command);
		} else {
			$browser = $this->getBrowser();
			$response = $browser->request($this->urls[$command - 1]);
			$content = $response->getContent();
			$this->outputLine($content);
		}
	}

	/**
	 * @return void
	 */
	public function helpCommand() {
		for ($i = 0; $i < count($this->urls); $i++) {
			$this->outputLine($i + 1 . ' ' . $this->urls[$i]);
		}
	}

}
