<?php
namespace Lightwerk\SurfCaptain\Crawler\Package;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */
use Lightwerk\SurfCaptain\Crawler\Project\ProjectInterface;

/**
 * TYPO3Extension
 *
 * @package Lightwerk\SurfCaptain
 */
class TYPO3Extension implements PackageInterface
{
    /**
     * @var string
     */
    protected $version = '0.0.0';

    /**
     * @var string
     */
    protected $name = '';

    /**
     * @var ProjectInterface
     */
    protected $project = '';

    /**
     * @var int
     */
    protected $type = PackageInterface::TYPE_UNKNOWN;

    /**
     * @var string
     */
    protected $category = 'TYPO3 Extension';

    /**
     * @var PackageInterface[]
     */
    protected $versions = [];

    /**
     * @var bool
     */
    protected $active = true;

    /**
     * TYPO3Extension constructor.
     * @param string $name
     * @param string $version
     * @param int $type
     * @param ProjectInterface $project
     */
    public function __construct($name, $version, $type, $project)
    {
        $this->name = $name;
        $this->version = $version;
        $this->type = $type;
        $this->project = $project;
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
     * @return ProjectInterface
     */
    public function getProject(): ProjectInterface
    {
        return $this->project;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->active;
    }

    /**
     * @return string
     */
    public function getCategory(): string
    {
        return $this->category;
    }

    /**
     * @param PackageInterface $package
     */
    public function addVersion($package)
    {
        $this->versions[$package->getVersion()][] = $package;
    }

    /**
     * @return PackageInterface[]
     */
    public function getVersions(): array
    {
        $this->addVersion($this);
        return $this->versions;
    }

    /**
     * @return string
     */
    public function getProjectName(): string
    {
        return $this->project->getName();
    }
}
