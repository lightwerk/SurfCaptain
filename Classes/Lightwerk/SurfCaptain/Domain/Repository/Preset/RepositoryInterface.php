<?php
namespace Lightwerk\SurfCaptain\Domain\Repository\Preset;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Contract for a preset repository
 *
 * @package Lightwerk\SurfCaptain
 */
interface RepositoryInterface
{
    /**
     * Inject settings
     *
     * @param array $settings
     * @return void
     */
    public function injectSettings(array $settings);

    /**
     * Adds a preset to this repository.
     *
     * @param string $identifier
     * @param array $configuration
     * @return void
     */
    public function add($identifier, array $configuration);

    /**
     * Updates a given preset.
     *
     * @param string $identifier
     * @param array $configuration
     * @return void
     */
    public function update($identifier, array $configuration);

    /**
     * Removes a preset from this repository.
     *
     * @param string $identifier
     * @return void
     */
    public function remove($identifier);

    /**
     * Returns all presets of this repository.
     *
     * @return array $presets
     */
    public function findAll();

    /**
     * Finds a preset matching the given identifier.
     *
     * @param string $identifier
     * @return array $configuration
     */
    public function findByIdentifier($identifier);

    /**
     * Find presets matching the given repositoryUrl.
     *
     * @param string $repositoryUrl
     * @return array $presets
     */
    public function findByRepositoryUrl($repositoryUrl);

    /**
     * Finds all presets without a repositoryUrl.
     *
     * @return array $presets
     */
    public function findGlobals();
}
