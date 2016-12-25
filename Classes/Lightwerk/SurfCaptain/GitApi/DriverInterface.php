<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */
use Lightwerk\SurfCaptain\Domain\Model\Repository;


/**
 * Driver Interface
 *
 * @package Lightwerk\SurfCaptain
 */
interface DriverInterface
{
    /**
     * @param array $settings
     * @return void
     */
    public function setSettings(array $settings);

    /**
     * @return Repository[]
     */
    public function getRepositories();

    /**
     * @param string $repositoryUrl
     * @return Repository
     */
    public function getRepository($repositoryUrl);

    /**
     * @param string $repositoryUrl
     * @return boolean
     */
    public function hasRepository($repositoryUrl);

    /**
     * @param string $repositoryUrl
     * @param string $filePath
     * @param string $reference branch name, tag name or hash
     * @return string
     */
    public function getFileContent($repositoryUrl, $filePath, $reference = 'master');

    /**
     * @param string $repositoryUrl
     * @param string $filePath
     * @param string $content
     * @param string $commitMessage
     * @param string $branchName
     * @return void
     */
    public function setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName = 'master');
}
