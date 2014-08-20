<?php
namespace Lightwerk\SurfCaptain\Domain\Model;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

class Tag {

	/**
	 * @var string
	 */
	protected $name;

	/**
	 * @var Commit
	 */
	protected $commit;


	/**
	 * @return string
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @param string $name
	 * @return Tag
	 */
	public function setName($name) {
		$this->name = $name;
		return $this;
	}

	/**
	 * @return Commit
	 */
	public function getCommit() {
		return $this->commit;
	}

	/**
	 * @param Commit $commit
	 * @return Tag
	 */
	public function setCommit($commit) {
		$this->commit = $commit;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getType() {
		return 'Tag';
	}

	/**
	 * @return string
	 */
	public function getGroup() {
		return 'Tags';
	}

	/**
	 * @return string
	 */
	public function getIdentifier() {
		return 'tag-' . $this->getCommit()->getId();
	}

}