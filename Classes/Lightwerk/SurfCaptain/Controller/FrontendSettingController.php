<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class FrontendSettingController extends AbstractRestController {

	/**
	 * @return void
	 */
	public function listAction() {
		$frontendSettings = array();
		if (!empty($this->settings['frontendSettings']) && is_array($this->settings['frontendSettings'])) {
			$frontendSettings = $this->settings['frontendSettings'];
		}
		$this->view->assign('frontendSettings', $frontendSettings);
	}
}