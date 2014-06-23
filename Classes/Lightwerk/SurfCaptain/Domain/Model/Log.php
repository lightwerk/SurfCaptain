<?php
namespace Lightwerk\SurfCaptain\Domain\Model;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Doctrine\ORM\Mapping as ORM;

/**
 * @Flow\Entity
 */
class Log {

	/**
	 * @var \Lightwerk\SurfCaptain\Domain\Model\Deployment
	 * @ORM\ManyToOne(inversedBy="logs")
	 */
	protected $deployment;

	/**
	 * @var \DateTime
	 */
	protected $date;

	/**
	 * @var string
	 */
	protected $stage;

	/**
	 * @var string
	 */
	protected $task;

	/**
	 * @var string
	 */
	protected $message;

	/**
	 * @var string
	 */
	protected $severity;


	/**
	 * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
	 */
	public function getDeployment() {
		return $this->deployment;
	}

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Model\Deployment $deployment
	 * @return void
	 */
	public function setDeployment($deployment) {
		$this->deployment = $deployment;
	}

	/**
	 * @return \DateTime
	 */
	public function getDate() {
		return $this->date;
	}

	/**
	 * @param \DateTime $date
	 * @return void
	 */
	public function setDate($date) {
		$this->date = $date;
	}

	/**
	 * @return string
	 */
	public function getStage() {
		return $this->stage;
	}

	/**
	 * @param string $stage
	 * @return void
	 */
	public function setStage($stage) {
		$this->stage = $stage;
	}

	/**
	 * @return string
	 */
	public function getTask() {
		return $this->task;
	}

	/**
	 * @param string $task
	 * @return void
	 */
	public function setTask($task) {
		$this->task = $task;
	}

	/**
	 * @return string
	 */
	public function getMessage() {
		return $this->message;
	}

	/**
	 * @param string $message
	 * @return void
	 */
	public function setMessage($message) {
		$this->message = $message;
	}

	/**
	 * @return string
	 */
	public function getSeverity() {
		return $this->severity;
	}

	/**
	 * @param string $severity
	 * @return void
	 */
	public function setSeverity($severity) {
		$this->severity = $severity;
	}

}