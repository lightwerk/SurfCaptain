<?php
namespace Lightwerk\SurfCaptain\Crawler\Project;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */
use Lightwerk\SurfCaptain\Crawler\Package\PackageInterface;

/**
 * ProjectInterface
 *
 * @package Lightwerk\SurfCaptain
 */
interface ProjectInterface
{
    /**
     * @return string
     */
    public function getVersion();

    /**
     * @return string
     */
    public function getName();

    /**
     * @return string
     */
    public function getCategory();

    /**
     * @param PackageInterface $package
     */
    public function addPackage(PackageInterface $package);

    /**
     * @return PackageInterface[]
     */
    public function getPackages();
}
