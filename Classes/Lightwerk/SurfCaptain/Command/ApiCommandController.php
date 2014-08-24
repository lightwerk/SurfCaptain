<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class ApiCommandController extends BrowserCommandController {

	/**
	 * @var array
	 */
	protected $urls = array(
		'http://surf/api/repository',
		'http://surf/api/repository?repositoryUrl=git%40git.lightwerk.com%3Aproject%2Fgtweb.git',
		'http://surf/api/preset',
		'http://surf/api/preset?key=test_af',
		'http://surf/api/preset?key=sma',
		'http://surf/api/preset?key=foo',
		'http://surf/api/deployment',
		'http://surf/api/frontendsetting',
	);


}
