<?php
namespace Lightwerk\SurfCaptain\Crawler\Detector;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

/**
 * DetectorInterface
 *
 * @package Lightwerk\SurfCaptain
 */
interface DetectorInterface
{
    /**
     * @return bool
     */
    public function success();
}
