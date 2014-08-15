<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Configuration\ConfigurationManager;
use TYPO3\Flow\Annotations as Flow;

class FrontendSettingController extends AbstractRestController {

	/**
	 * @var ConfigurationManager
	 * @FLOW\Inject
	 */
	protected $configurationManager;

	/**
	 * @return void
	 */
	public function listAction() {
		$this->view->assign('frontendSettings', $this->configurationManager->getFrontendSettings());
	}
}