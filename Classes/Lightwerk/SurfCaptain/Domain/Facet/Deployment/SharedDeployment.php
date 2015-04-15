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
class SharedDeployment {

	/**
	 * @var string
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $sourcePresetKey;

	/**
	 * @var string
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $targetPresetKey;

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

	/**
	 * @return string
	 */
	public function getTargetPresetKey() {
		return $this->targetPresetKey;
	}

	/**
	 * @param string $targetPresetKey
	 * @return void
	 */
	public function setTargetPresetKey($targetPresetKey) {
		$this->targetPresetKey = $targetPresetKey;
	}

}
