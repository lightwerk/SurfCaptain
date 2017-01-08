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
abstract class AbstractDeployment
{
    /**
     * @var string
     */
    protected $presetKey;

    /**
     * @var string
     */
    protected $deploymentType;

    /**
     * @return string
     */
    public function getDeploymentType()
    {
        return $this->deploymentType;
    }

    /**
     * @param string $deploymentType
     * @return void
     */
    public function setDeploymentType($deploymentType)
    {
        $this->deploymentType = $deploymentType;
    }

    /**
     * @return string
     */
    public function getPresetKey()
    {
        return $this->presetKey;
    }

    /**
     * @param string $presetKey
     * @return void
     */
    public function setPresetKey($presetKey)
    {
        $this->presetKey = $presetKey;
    }
}
