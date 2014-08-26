<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Branch;
use Lightwerk\SurfCaptain\Domain\Model\Repository;
use Lightwerk\SurfCaptain\Domain\Model\Tag;

interface RepositoryDriverInterface {

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
	 * @return Repository[]
	 */
	public function getRepositories();

	/**
	 * Returns repository
	 *
	 * @param string $repositoryUrl
	 * @return Repository
	 */
	public function getRepository($repositoryUrl);

	/**
	 * Returns branches of a repository
	 *
	 * @param string $repositoryUrl
	 * @return Branch[]
	 */
	public function getBranches($repositoryUrl);

	/**
	 * Returns tags of a repository
	 *
	 * @param string $repositoryUrl
	 * @return Tag[]
	 */
	public function getTags($repositoryUrl);
}
