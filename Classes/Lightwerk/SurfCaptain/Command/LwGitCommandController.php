<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Client\Browser;

class LwGitCommandController extends BrowserCommandController {

	/**
	 * @var array
	 */
	protected $urls = array(
		'/groups',
		'/groups/10',
		'/groups/project',
		'/v3/projects/project%2Fgtinter/repository/branches',
		'/projects/lm%2Flightwerk-surfcaptain-settings/repository/files?file_path=Presets.json&ref=master',
		'/projects',
		'/projects/209',
		'/projects/209/repository/branches',
		'/projects/209/repository/tags',
	);

	/**
	 * @return void
	 */
	protected function extendBrowser(Browser $browser) {
		$token = $this->settings['sources']['git.lightwerk.com']['privateToken'];
		$browser->getRequestEngine()->setOption(CURLOPT_HTTPHEADER, array('PRIVATE-TOKEN: ' . $token));
		return $browser;
	}

	/**
	 * @return string
	 */
	protected function getUrlPrefix() {
		$prefix = $this->settings['sources']['git.lightwerk.com']['apiUrl'];
		return $prefix;
	}

}
