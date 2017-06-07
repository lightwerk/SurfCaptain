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
     * @var array
     */
    protected $packageList = [];

    /**
     * @var array
     */
    protected $projectList = [];

    /**
     * @return array
     */
    public function getPackageList(): array
    {
         return $this->packageList;
    }

    /**
     * @return array
     */
    public function getProjectList(): array
    {
        return $this->projectList;
    }

    /**
     * @param PackageInterface $package
     */
    private function addPackage(PackageInterface $package)
    {
        if (empty($this->packageList[$package->getCategory()])) {
            $this->packageList[$package->getCategory()] = [];
        }

        if (empty($this->packageList[$package->getCategory()][$package->getName()])) {
            $this->packageList[$package->getCategory()][$package->getName()] = [];
            $this->packageList[$package->getCategory()][$package->getName()]['count'] = 0;
            $this->packageList[$package->getCategory()][$package->getName()]['name'] = $package->getName();
            $this->packageList[$package->getCategory()][$package->getName()]['versions'] = [];
        }
        $this->packageList[$package->getCategory()][$package->getName()]['count']++;

        if (empty($this->packageList[$package->getCategory()][$package->getName()]['versions'][$package->getVersion()])) {
            $this->packageList[$package->getCategory()][$package->getName()]['versions'][$package->getVersion()] = [];
            $this->packageList[$package->getCategory()][$package->getName()]['versions'][$package->getVersion()]['count'] = 0;
            $this->packageList[$package->getCategory()][$package->getName()]['versions'][$package->getVersion()]['projects'] = [];
        }
        $this->packageList[$package->getCategory()][$package->getName()]['versions'][$package->getVersion()]['count']++;
        $this->packageList[$package->getCategory()][$package->getName()]['versions'][$package->getVersion()]['projects'][$package->getProject()->getName()] = $package->getType();


        if (empty($this->projectList[$package->getProject()->getName()]['packages'][$package->getCategory()])) {
            $this->projectList[$package->getProject()->getName()]['packages'][$package->getCategory()] = [];
            $this->projectList[$package->getProject()->getName()]['packages'][$package->getCategory()]['count'] = 0;
            $this->projectList[$package->getProject()->getName()]['packages'][$package->getCategory()]['packages'] = [];
        }
        $this->projectList[$package->getProject()->getName()]['packages'][$package->getCategory()]['count']++;
        $this->projectList[$package->getProject()->getName()]['packages'][$package->getCategory()]['packages'][] = [
            'name' => $package->getName(),
            'version' => $package->getVersion(),
            'type' => $package->getType()
        ];
    }

    /**
     * @param ProjectInterface $project
     */
    public function addProject(ProjectInterface $project)
    {
        if (empty($this->projectList[$project->getName()])) {
            $this->projectList[$project->getName()] = [];
        }
        $this->projectList[$project->getName()]['version'] = $project->getVersion();
        $this->projectList[$project->getName()]['category'] = $project->getCategory();
        foreach ($project->getPackages() as $package) {
            $this->addPackage($package);
        }
    }
}
