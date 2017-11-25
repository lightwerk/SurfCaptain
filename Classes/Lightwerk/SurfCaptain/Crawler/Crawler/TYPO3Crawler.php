<?php
namespace Lightwerk\SurfCaptain\Crawler\Crawler;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */
use Lightwerk\SurfCaptain\Crawler\CrawlingResult;
use Lightwerk\SurfCaptain\Crawler\Package\PackageInterface;
use Lightwerk\SurfCaptain\Crawler\Package\TYPO3Extension;
use Lightwerk\SurfCaptain\Crawler\Project\ProjectInterface;
use Lightwerk\SurfCaptain\Crawler\Project\TYPO3Project;

/**
 * TYPO3Crawler
 *
 * @package Lightwerk\SurfCaptain
 */
class TYPO3Crawler implements CrawlerInterface
{
    /**
     * @var \DirectoryIterator
     */
    protected $directory;

    /**
     * @var string
     */
    protected $webDir = '';

    /**
     * @var TYPO3Project
     */
    protected $project = null;

    /**
     * @var string
     */
    protected $pathToExtensions = 'typo3conf' . DIRECTORY_SEPARATOR .'ext' . DIRECTORY_SEPARATOR;

    /**
     * @var array
     */
    protected $extensionCache = [];

    /**
     * @param \DirectoryIterator $directory
     */
    public function __construct(\DirectoryIterator $directory)
    {
        $this->directory = $directory;
        $this->webDir = $this->getWebDir();
        $this->project = new TYPO3Project($this->getProjectName(), '0.0.0');
    }

    /**
     * @param CrawlingResult $crawlingResult
     */
    public function addToCrawlingResult(CrawlingResult $crawlingResult)
    {
        $this->addPackagesLoadedByComposer();
        $this->addExtensionsFromProject();
        $crawlingResult->addProject($this->project);
    }

    private function addPackagesLoadedByComposer()
    {
        $composerLockPath = $this->directory->getPath() . DIRECTORY_SEPARATOR . 'composer.lock';
        if (!is_file($composerLockPath)) {
            return;
        }

        $json = json_decode(file_get_contents($composerLockPath), true);
        if (empty($json['packages'])) {
            return;
        }

        foreach ($json['packages'] as $composerPackage) {
            if (empty($composerPackage['type'])) {
                continue;
            }

            switch ($composerPackage['type']) {
                case 'typo3-cms-extension':
                    // extension
                    $this->addExtension(
                        $this->getExtensionNameFromComposerPackage($composerPackage),
                        $composerPackage['version'],
                        true
                    );
                    break;
                case 'typo3-cms-core':
                    // core
                    $this->project->setVersion($composerPackage['version']);
                    break;
            }
        }
    }

    /**
     * @param array $composerPackage
     * @return string
     */
    private function getExtensionNameFromComposerPackage(array $composerPackage): string
    {
        if (!empty($composerPackage['replace'])) {
            foreach ($composerPackage['replace'] as $replacementName => $unused) {
                if (strpos($replacementName, 'typo3-ter/') === false) {
                    return $replacementName;
                }
            }
        }

        $extensionName = preg_replace('#^.*/#', '', $composerPackage['name']);
        return str_replace('-', '_', $extensionName);
    }

    /**
     * @param string $extensionName
     * @param string $version
     * @param bool $composer
     */
    private function addExtension($extensionName, $version = '0.0.0', $composer = false)
    {
        if (in_array($extensionName, $this->extensionCache)) {
            return;
        }
        $pathToExtension = $this->directory->getPath() . DIRECTORY_SEPARATOR . $this->webDir . $this->pathToExtensions . $extensionName;
        if (file_exists($pathToExtension)) {
            if ($version === '0.0.0' && file_exists($pathToExtension . DIRECTORY_SEPARATOR . 'ext_emconf.php')) {
                $_EXTKEY = $extensionName;
                /** @noinspection PhpIncludeInspection */
                require($pathToExtension . DIRECTORY_SEPARATOR . 'ext_emconf.php');
                if (!empty($EM_CONF[$_EXTKEY]['version'])) {
                    $version = $EM_CONF[$_EXTKEY]['version'];
                }
            }
            $type = $composer ? PackageInterface::TYPE_TYPO3_EXT_COMPOSER : PackageInterface::TYPE_TYPO3_EXT_DEFAULT;
            $extension = new TYPO3Extension($extensionName, $version, $type, $this->project);
            $this->project->addPackage($extension);
            $this->extensionCache[] = $extensionName;
        }
    }

    /**
     * Looks for a configured webDir in composer.json
     * and stores it in $this->webDir
     *
     * @return string
     */
    private function getWebDir(): string
    {
        $composerJsonPath = $this->directory->getPath() . DIRECTORY_SEPARATOR . 'composer.json';
        if (!is_file($composerJsonPath)) {
            return '';
        }
        $json = json_decode(file_get_contents($composerJsonPath), true);
        if (!empty($json['extra']['typo3/cms']['web-dir'])) {
            return rtrim($json['extra']['typo3/cms']['web-dir'], '/') . DIRECTORY_SEPARATOR;
        }
        return '';
    }

    /**
     * @return string
     */
    private function getProjectName(): string
    {
        $localConfiguration = $this->directory->getPath() . DIRECTORY_SEPARATOR . $this->webDir . 'typo3conf' . DIRECTORY_SEPARATOR . 'LocalConfiguration.php';
        if (file_exists($localConfiguration)) {
            /** @noinspection PhpIncludeInspection */
            $config = require($localConfiguration);
            if (!empty($config['SYS']['sitename'])) {
                return $config['SYS']['sitename'];
            }
        }
        $composerJsonPath = $this->directory->getPath() . DIRECTORY_SEPARATOR . 'composer.json';
        if (!is_file($composerJsonPath)) {
            return '';
        }
        $json = json_decode(file_get_contents($composerJsonPath), true);
        if (!empty($json['name'])) {
            return $json['name'];
        }
        return '';
    }

    private function addExtensionsFromProject()
    {
        $extensionDirPath = $this->directory->getPath() . DIRECTORY_SEPARATOR . $this->webDir . $this->pathToExtensions;
        $extensionDir = new \DirectoryIterator($extensionDirPath);

        foreach ($extensionDir as $extension) {
            if ($extension->isDot() || !$extension->isDir()) {
                continue;
            }
            if (file_exists($extension->getPathname() . DIRECTORY_SEPARATOR . 'ext_emconf.php')) {
                $this->addExtension($extension->getBasename());
            }
        }

        // TODO set version in $this->project if not already set during parsing of composer.lock
    }
}
