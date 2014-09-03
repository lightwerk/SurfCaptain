<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */


/**
 * Driver Interface
 *
 * @package Lightwerk\SurfCaptain
 */
interface DriverInterface {

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
}
