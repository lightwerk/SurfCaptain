<?php
namespace Lightwerk\SurfCaptain\Domain\Repository\Preset;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Preset repository with git backend
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class GitRepository extends AbstractRepository implements RepositoryInterface
{
    /**
     * @var \Lightwerk\SurfCaptain\GitApi\DriverComposite
     * @Flow\Inject
     */
    protected $driverComposite;

    /**
     * Cache to reduce request
     *
     * @var array
     */
    protected $presets;

    /**
     * Inject settings
     *
     * @param array $settings
     * @return void
     */
    public function injectSettings(array $settings)
    {
        $this->settings = $settings['repository']['preset']['gitRepository'];
    }

    /**
     * Saves the presets.
     *
     * @param array $presets
     * @param string $logMessage
     * @return void
     */
    protected function savePresets(array $presets, $logMessage)
    {
        $this->driverComposite->setFileContent(
            $this->settings['repositoryUrl'],
            $this->settings['filePath'],
            json_encode($presets, JSON_PRETTY_PRINT),
            '[SURFCAPTAIN] ' . $logMessage
        );
        $this->presets = null;
    }

    /**
     * Load the presets.
     *
     * @return array $presets
     * @throws Exception
     */
    protected function loadPresets()
    {
        if (!isset($this->presets)) {
            $this->presets = json_decode(
                $this->driverComposite->getFileContent($this->settings['repositoryUrl'], $this->settings['filePath']),
                true
            );
            if (empty($this->presets)) {
                throw new Exception('Could not load presets', 1407782202);
            }
        }
        return $this->presets;
    }
}
