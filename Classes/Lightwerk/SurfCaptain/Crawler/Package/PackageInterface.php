<?php
namespace Lightwerk\SurfCaptain\Crawler\Package;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */
use Lightwerk\SurfCaptain\Crawler\Project\ProjectInterface;

/**
 * PackageInterface
 *
 * @package Lightwerk\SurfCaptain
 */
interface PackageInterface
{
    const TYPE_UNKNOWN = 0;
    const TYPE_TYPO3_EXT_DEFAULT = 1;
    const TYPE_TYPO3_EXT_COMPOSER = 2;
    const TYPE_COMPOSER_PACKAGE = 3;

    /**
     * @return string
     */
    public function getVersion();

    /**
     * @return string
     */
    public function getName();

    /**
     * @return ProjectInterface
     */
    public function getProject();

    /**
     * @return int
     */
    public function getType();

    /**
     * @return bool
     */
    public function isActive();

    /**
     * @return string
     */
    public function getCategory();

    /**
     * @param PackageInterface $package
     */
    public function addVersion($package);

    /**
     * @return PackageInterface[]
     */
    public function getVersions();

    /**
     * @return string
     */
    public function getProjectName();
}
