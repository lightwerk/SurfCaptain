<?php
namespace Lightwerk\SurfCaptain\Domain\Model;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

class Branch {

	/**
	 * @var string
	 */
	protected $name;

	/**
	 * @var Commit[]
	 */
	protected $commits;

	/**
	 * @return string
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @param string $name
	 * @return Branch
	 */
	public function setName($name) {
		$this->name = $name;
		return $this;
	}

	/**
	 * @return Commit[]
	 */
	public function getCommits() {
		return $this->commits;
	}

	/**
	 * @param Commit[] $commits
	 * @return Branch
	 */
	public function setCommits(array $commits) {
		$this->commits = $commits;
		return $this;
	}

	/**
	 * @param Commit $commit
	 * @return Branch
	 */
	public function addCommit(Commit $commit) {
		$this->commits[] = $commit;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getType() {
		return 'Branch';
	}

	/**
	 * @return string
	 */
	public function getGroup() {
		return 'Branches';
	}
}