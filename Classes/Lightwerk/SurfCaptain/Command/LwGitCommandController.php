<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class LwGitCommandController extends BrowserCommandController {

	/**
	 * @var array
	 */
	protected $urls = array(
		'https://localhost:1443/api/v3/groups',
		'https://localhost:1443/api/v3/groups/10',
		'https://git.lightwerk.com/api/v3/projects/project%2Fgtinter/repository/branches',
		'https://localhost:1443/api/v3/projects/lm%2Flightwerk-surfcaptain-settings/repository/files?file_path=Presets.json&ref=master',
		'https://localhost:1443/api/v3/projects',
		'https://localhost:1443/api/v3/projects/209',
		'https://localhost:1443/api/v3/projects/209/repository/branches',
		'https://localhost:1443/api/v3/projects/209/repository/tags',
	);

	/**
	 * @return void
	 */
	public function testCommand() {
		$url = 'https://localhost:1443/api/v3/projects/lm%2Flightwerk-surfcaptain-settings/repository/files';
			$browser = $this->getBrowser();
			#$browser->getRequestEngine()->setOption();
			$response = $browser->request($url);
			$content = $response->getContent();
			$this->outputLine($content);
	}

	/**
	 * @return void
	 */
	protected function getBrowser() {
		$browser = parent::getBrowser();
		$token = $this->settings['sources']['git.lightwerk.com']['privateToken'];
		$browser->getRequestEngine()->setOption(CURLOPT_HTTPHEADER, array('PRIVATE-TOKEN: ' . $token));
		return $browser;
	}

}
