<?php
namespace Lightwerk\SurfCaptain\Service\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

interface DriverInterface {

	/**
	 * Sets the settings
	 *
	 * @param array $settings
	 * @return void
	 */
	public function setSettings(array $settings);

	/**
	 * Returns repositories
	 *
	 * @return array
	 */
	public function getRepositories();

	/**
	 * Return the content of a file
	 *
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 */
	public function getFileContent($repositoryUrl, $filePath, $reference = 'master');

	/**
	 * Sets the content of a file
	 *
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $content
	 * @param string $commitMessage
	 * @param string $branchName
	 * @return void
	 */
	public function setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName = 'master');

	/**
	 * Returns branches of a repository
	 *
	 * @param string $repositoryUrl
	 * @return array
	 */
	public function getBranches($repositoryUrl);

	/**
	 * Returns tags of a repository
	 *
	 * @param string $repositoryUrl
	 * @return array
	 */
	public function getTags($repositoryUrl);
}
