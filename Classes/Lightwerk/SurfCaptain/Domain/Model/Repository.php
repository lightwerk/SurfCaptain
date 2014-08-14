<?php
namespace Lightwerk\SurfCaptain\Domain\Model;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

class Repository {

	/**
	 * @var string
	 */
	protected $repositoryUrl;

	/**
	 * @var string
	 */
	protected $name;

	/**
	 * @var string
	 */
	protected $webUrl;

	/**
	 * @var Tag[]
	 */
	protected $tags;

	/**
	 * @var Branch[]
	 */
	protected $branches;


	/**
	 * @return string
	 */
	public function getRepositoryUrl() {
		return $this->repositoryUrl;
	}

	/**
	 * @param string $repositoryUrl
	 * @return Repository
	 */
	public function setRepositoryUrl($repositoryUrl) {
		$this->repositoryUrl = $repositoryUrl;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @param string $name
	 * @return Repository
	 */
	public function setName($name) {
		$this->name = $name;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getWebUrl() {
		return $this->webUrl;
	}

	/**
	 * @param string $webUrl
	 * @return Repository
	 */
	public function setWebUrl($webUrl) {
		$this->webUrl = $webUrl;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getIdentifier() {
		return preg_replace('/[^A-Za-z0-9]/', '', strtolower($this->getName())
			. '-'
			. substr(sha1($this->getRepositoryUrl()), 0, 4));
	}

	/**
	 * @return Branch[]
	 */
	public function getBranches() {
		return $this->branches;
	}

	/**
	 * @param Branch[] $branches
	 * @return Repository
	 */
	public function setBranches($branches) {
		$this->branches = $branches;
		return $this;
	}

	/**
	 * @return Tag[]
	 */
	public function getTags() {
		return $this->tags;
	}

	/**
	 * @param Tag[] $tags
	 * @return Repository
	 */
	public function setTags($tags) {
		$this->tags = $tags;
		return $this;
	}
}