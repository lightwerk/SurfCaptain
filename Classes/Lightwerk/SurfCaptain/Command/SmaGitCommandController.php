<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class SmaGitCommandController extends BrowserCommandController {

	/**
	 * @var array
	 */
	protected $urls = array(
		'http://git.sma.de/api/v3/projects',
		'http://git.sma.de/api/v3/projects/2',
		'http://git.sma.de/api/v3/projects/sma-websites%2Frcw-sma-de',
		'http://git.sma.de/api/v3/projects/2/repository/tags',
		'http://git.sma.de/api/v3/projects/2/repository/branches',
	);

	/**
	 * @return void
	 */
	protected function getBrowser() {
		$browser = parent::getBrowser();
		$token = $this->settings['sources']['git.sma.de']['privateToken'];
		$browser->getRequestEngine()->setOption(CURLOPT_HTTPHEADER, array('PRIVATE-TOKEN: ' . $token));
		return $browser;
	}

}
