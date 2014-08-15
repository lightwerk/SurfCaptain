<?php
namespace Lightwerk\SurfCaptain\Configuration;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class ConfigurationManager {

	/**
	 * @var array
	 */
	protected $settings = array();

	/**
	 * Inject the settings
	 *
	 * @param array $settings
	 * @return void
	 */
	public function injectSettings(array $settings) {
		$this->settings = $settings;
	}

	/**
	 * @return array
	 */
	public function getFrontendSettings() {
		$frontendSettings = array();
		if (!empty($this->settings['frontendSettings']) && is_array($this->settings['frontendSettings'])) {
			$frontendSettings = $this->settings['frontendSettings'];
		}
		return $frontendSettings;
	}
}