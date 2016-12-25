<?php
namespace Lightwerk\SurfCaptain\GitApi\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\GitApi\DriverInterface;

abstract class AbstractDriver implements DriverInterface
{
    /**
     * @var array
     */
    protected $settings;

    /**
     * @FLow\Inject
     * @var \Lightwerk\SurfCaptain\Mapper\DataMapper
     */
    protected $dataMapper;

    /**
     * @var \TYPO3\Flow\Object\ObjectManagerInterface
     * @Flow\Inject
     */
    protected $objectManager;

    /**
     * @var \Lightwerk\SurfCaptain\GitApi\ApiRequest
     */
    protected $apiRequest;

    /**
     * @param string $repositoryUrl
     * @return string
     */
    protected function getRepositoryName($repositoryUrl)
    {
        $parts = explode(':', $repositoryUrl);
        return str_replace('.git', '', $parts[1]);
    }

    /**
     * @param string $repositoryUrl
     * @return string
     */
    protected function getRepositoryAccount($repositoryUrl)
    {
        $parts = explode(':', $repositoryUrl);
        return $parts[0];
    }
}
