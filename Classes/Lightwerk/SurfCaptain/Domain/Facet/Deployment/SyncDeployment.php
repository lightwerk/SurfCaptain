<?php
namespace Lightwerk\SurfCaptain\Domain\Facet\Deployment;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("prototype")
 */
class SyncDeployment extends AbstractDeployment {

	/**
	 * @var string
	 */
	protected $deploymentType = 'TYPO3\\CMS\\Sync';

	/**
	 * @var string
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $sourcePresetKey;

	/**
	 * @return string
	 */
	public function getSourcePresetKey() {
		return $this->sourcePresetKey;
	}

	/**
	 * @param string $sourcePresetKey
	 * @return void
	 */
	public function setSourcePresetKey($sourcePresetKey) {
		$this->sourcePresetKey = $sourcePresetKey;
	}
}
