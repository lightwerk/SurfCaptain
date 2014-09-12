<?php
namespace Lightwerk\SurfCaptain\Service;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Repository;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

/**
 * Git Service Interface
 *
 * @package Lightwerk\SurfCaptain
 */
interface GitServiceInterface {

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
