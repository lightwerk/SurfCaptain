<?php
namespace Lightwerk\SurfCaptain\Domain\Repository\Preset;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Abstract Repository
 *
 * @package Lightwerk\SurfCaptain
 */
abstract class AbstractRepository implements RepositoryInterface {

	/**
	 * Saves the presets.
	 *
	 * @param array $presets
	 * @return void
	 */
	abstract protected function savePresets(array $presets);

	/**
	 * Load the presets.
	 *
	 * @return array $presets
	 */
	abstract protected function loadPresets();

	/**
	 * @var array
	 */
	protected $settings;

	/**
	 * Adds a preset to this repository.
	 *
	 * @param string $identifier
	 * @param array $configuration
	 * @return void
	 * @throws Exception
	 */
	public function add($identifier, array $configuration) {
		$presets = $this->loadPresets();
		if (!empty($presets[$identifier])) {
			throw new Exception('Preset exists already', 1410552459);
		}
		if (empty($configuration)) {
			throw new Exception('Empty configuration is not allowed', 1410595656);
		}
		$presets[$identifier] = $configuration;
		ksort($presets);
		$this->savePresets($presets);
	}

	/**
	 * Updates a given preset.
	 *
	 * @param string $identifier
	 * @param array $configuration
	 * @return void
	 * @throws Exception
	 */
	public function update($identifier, array $configuration) {
		$presets = $this->loadPresets();
		if (empty($presets[$identifier])) {
			throw new Exception('Could not find preset', 1410552339);
		}
		if (empty($configuration)) {
			throw new Exception('Empty configuration is not allowed', 1410595612);
		}
		$presets[$identifier] = $configuration;
		$this->savePresets($presets);
	}

	/**
	 * Removes a preset from this repository.
	 *
	 * @param string $identifier
	 * @return void
	 * @throws Exception
	 */
	public function remove($identifier) {
		$presets = $this->loadPresets();
		if (empty($presets[$identifier])) {
			throw new Exception('Could not find preset', 1410549993);
		}
		unset($presets[$identifier]);
		$this->savePresets($presets);
	}

	/**
	 * Returns all presets of this repository.
	 *
	 * @return array $presets
	 */
	public function findAll() {
		return $this->loadPresets();
	}

	/**
	 * Finds a preset matching the given identifier.
	 *
	 * @param string $identifier
	 * @return array $configuration
	 * @throws Exception
	 */
	public function findByIdentifier($identifier) {
		$presets = $this->loadPresets();
		if (empty($presets[$identifier])) {
			throw new Exception('Could not find preset', 1410549868);
		}
		return $presets[$identifier];
	}

	/**
	 * Find presets matching the given repositoryUrl.
	 *
	 * @param string $repositoryUrl
	 * @return array $presets
	 */
	public function findByRepositoryUrl($repositoryUrl) {
		$presets = $this->loadPresets();
		$repositoryPresets = array();
		foreach ($presets as $key => $preset) {
			foreach ($preset['applications'] as $application) {
				if (!empty($application['options']['repositoryUrl']) && $repositoryUrl === $application['options']['repositoryUrl']) {
					$repositoryPresets[$key] = $preset;
				}
			}
		}
		return $repositoryPresets;
	}

	/**
	 * Finds all presets without a repositoryUrl.
	 *
	 * @return array $presets
	 */
	public function findGlobals() {
		$presets = $this->loadPresets();
		$globalPresets = array();
		foreach ($presets as $key => $preset) {
			foreach ($preset['applications'] as $application) {
				if (empty($application['options']['repositoryUrl'])) {
					$globalPresets[$key] = $preset;
				}
			}
		}
		return $globalPresets;
	}
}