<?php
namespace Lightwerk\SurfCaptain\Domain\Facet\Deployment;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("prototype")
 */
class InitSharedDeployment extends SharedDeployment {

	/**
	 * @var string
	 */
	protected $database = '';

	/**
	 * @var string
	 */
	protected $host = 'localhost';

	/**
	 * @var string
	 */
	protected $user = 'dev';

	/**
	 * @var string
	 */
	protected $password = 'dev';


	/**
	 * @return string
	 */
	public function getDatabase() {
		return $this->database;
	}

	/**
	 * @param string $database
	 * @return void
	 */
	public function setDatabase($database) {
		$this->database = $database;
	}

	/**
	 * @return string
	 */
	public function getHost() {
		return $this->host;
	}

	/**
	 * @param string $host
	 * @return void
	 */
	public function setHost($host) {
		$this->host = $host;
	}

	/**
	 * @return string
	 */
	public function getUser() {
		return $this->user;
	}

	/**
	 * @param string $user
	 * @return void
	 */
	public function setUser($user) {
		$this->user = $user;
	}

	/**
	 * @return string
	 */
	public function getPassword() {
		return $this->password;
	}

	/**
	 * @param string $password
	 * @return void
	 */
	public function setPassword($password) {
		$this->password = $password;
	}

}
