<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Client\Browser;

class GitHubCommandController extends BrowserCommandController {

	/**
	 * @var array
	 */
	protected $urls = array(
		// list
		'users/achimfritz/repos',
		'users/lars85/repos',
		// show
		'repos/achimfritz/championship-distribution',
		'repos/achimfritz/championship-distribution/tags',
		'repos/achimfritz/championship-distribution/branches',
		'repos/achimfritz/Test',
		'repos/achimfritz/Test/test.txt',
		'repos/achimfritz/Test/contents/test.txt',
	);

	/**
	 * @return string
	 */
	protected function getUrlPrefix() {
		$prefix = $this->settings['sources']['github.com']['apiUrl'];
		return $prefix;
	}

	/**
	 * @return void
	 */
	protected function extendBrowser(Browser $browser) {
		$token = $this->settings['sources']['github.com']['privateToken'];
		$browser->getRequestEngine()->setOption(CURLOPT_HTTPHEADER, array('Authorization: token ' . $token));
		return $browser;
	}

}
