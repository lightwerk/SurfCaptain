<?php
namespace Lightwerk\SurfCaptain\Domain\Model;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Doctrine\ORM\Mapping as ORM;

/**
 * Log
 *
 * @package Lightwerk\SurfCaptain
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
	 * @var integer
	 */
	protected $number;

	/**
	 * @var string
	 * @ORM\Column(type="text")
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
	 * @return Log
	 */
	public function setDeployment($deployment) {
		$this->deployment = $deployment;
		return $this;
	}

	/**
	 * @return \DateTime
	 */
	public function getDate() {
		return $this->date;
	}

	/**
	 * @param \DateTime $date
	 * @return Log
	 */
	public function setDate($date) {
		$this->date = $date;
		return $this;
	}

	/**
	 * Returns Number
	 *
	 * @return int
	 */
	public function getNumber() {
		return $this->number;
	}

	/**
	 * Sets Number
	 *
	 * @param int $number
	 * @return Log
	 */
	public function setNumber($number) {
		$this->number = $number;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getMessage() {
		return $this->message;
	}

	/**
	 * @param string $message
	 * @return Log
	 */
	public function setMessage($message) {
		$this->message = $message;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getSeverity() {
		return $this->severity;
	}

	/**
	 * @param string $severity
	 * @return Log
	 */
	public function setSeverity($severity) {
		$this->severity = $severity;
		return $this;
	}

}