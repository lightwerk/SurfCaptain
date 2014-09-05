<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Client\Browser;

class SmaGitCommandController extends BrowserCommandController {

	/**
	 * @var array
	 */
	protected $urls = array(
		'/groups',
		'/projects',
		'/projects/2',
		'/projects/sma-websites%2Frcw-sma-de',
		'/projects/2/repository/tags',
		'/projects/2/repository/branches',
	);

	/**
	 * @return string
	 */
	protected function getUrlPrefix() {
		$prefix = $this->settings['sources']['git.sma.de']['apiUrl'];
		return $prefix;
	}

	/**
	 * @return void
	 */
	protected function extendBrowser(Browser $browser) {
		$token = $this->settings['sources']['git.sma.de']['privateToken'];
		$browser->getRequestEngine()->setOption(CURLOPT_HTTPHEADER, array('PRIVATE-TOKEN: ' . $token));
		return $browser;
	}

}
