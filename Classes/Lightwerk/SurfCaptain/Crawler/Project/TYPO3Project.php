<?php
namespace Lightwerk\SurfCaptain\Crawler\Project;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */
use Lightwerk\SurfCaptain\Crawler\Package\PackageInterface;

/**
 * TYPO3Project
 *
 * @package Lightwerk\SurfCaptain
 */
class TYPO3Project implements ProjectInterface
{
    /**
     * @var string
     */
    protected $version = '';

    /**
     * @var string
     */
    protected $name = '';

    /**
     * @var string
     */
    protected $category = 'TYPO3';

    /**
     * @var PackageInterface[]
     */
    protected $packages = [];


    public function __construct($name, $version)
    {
        $this->name = $name;
        $this->version = $version;
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        return $this->version;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getCategory(): string
    {
        return $this->category;
    }

    /**
     * @param string $version
     */
    public function setVersion(string $version)
    {
        $this->version = $version;
    }

    /**
     * @param PackageInterface $package
     */
    public function addPackage(PackageInterface $package)
    {
        $this->packages[] = $package;
    }

    /**
     * @return PackageInterface[]
     */
    public function getPackages()
    {
        return $this->packages;
    }
}
