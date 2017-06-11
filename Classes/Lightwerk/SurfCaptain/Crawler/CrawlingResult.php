<?php
namespace Lightwerk\SurfCaptain\Crawler;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */
use Lightwerk\SurfCaptain\Crawler\Package\PackageInterface;
use Lightwerk\SurfCaptain\Crawler\Project\ProjectInterface;

/**
 * PackageCollection
 *
 * @package Lightwerk\SurfCaptain
 */
class CrawlingResult
{
    /**
     * @var ProjectInterface[]
     */
    protected $projects = [];

    /**
     * @var PackageInterface[]
     */
    protected $packages = [];

    /**
     * @return ProjectInterface[]
     */
    public function getProjects(): array
    {
        return $this->projects;
    }

    /**
     * @param ProjectInterface $project
     */
    public function addProject(ProjectInterface $project)
    {
        $this->projects[] = $project;
    }

    /**
     * @return PackageInterface[]
     */
    public function getPackages(): array
    {
        foreach ($this->projects as $project) {
            foreach ($project->getPackages() as $newPackage) {
                foreach ($this->packages as $package) {
                    if ($package->getName() === $newPackage->getName() && $package->getCategory() === $package->getCategory()) {
                        $package->addVersion($newPackage);
                        continue 2;
                    }
                }
                $this->packages[] = $newPackage;
            }
        }
        return $this->packages;
    }
}
