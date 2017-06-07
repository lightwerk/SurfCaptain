<?php
namespace Lightwerk\SurfCaptain\Crawler\Detector;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

/**
 * AbstractDetector
 *
 * @package Lightwerk\SurfCaptain
 */
abstract class AbstractDetector implements DetectorInterface
{
    /**
     * @var \DirectoryIterator
     */
    protected $directory;

    /**
     * @var bool
     */
    protected $success = false;

    /**
     * Upon Initialization the detection has to be executed immediately, so that
     * success() can be called on any time after initialization to check for the
     * outcome of the detection.
     *
     * @param \DirectoryIterator $directory
     */
    public function __construct(\DirectoryIterator $directory)
    {
        $this->directory = $directory;
        $this->detect();
    }

    /**
     * @return bool
     */
    public function success()
    {
        return $this->success;
    }

    abstract protected function detect();
}
