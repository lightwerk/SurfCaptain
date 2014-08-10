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
class Deployment {

	/**
	 * @var \Doctrine\Common\Collections\Collection<\Lightwerk\SurfCaptain\Domain\Model\Log>
	 * @ORM\OneToMany(mappedBy="deployment")
	 * @ORM\OrderBy({"date" = "DESC"})
	 */
	protected $logs;

	/**
	 * @var integer
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $project;

	/**
	 * @var string
	 * @ORM\Column(type="text")
	 * @ORM\Column(length=40)
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $reference;

	/**
	 * @var string
	 * @ORM\Column(type="text")
	 * @ORM\Column(length=80)
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $referenceName;

	/**
	 * @var string
	 * @ORM\Column(type="text")
	 * @ORM\Column(length=15)
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $clientIp;

	/**
	 * @var string
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $status;

	/**
	 * @var \DateTime
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $date;

	/**
	 * @var array
	 * @ORM\Column(type="json_array")
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $configuration;

	/**
	 * Constructs a new Deployment
	 */
	public function __construct() {
		$this->logs = new \Doctrine\Common\Collections\ArrayCollection();
	}

	/**
	 * Returns Logs
	 *
	 * @return \Doctrine\Common\Collections\Collection<\Lightwerk\SurfCaptain\Domain\Model\Log>
	 */
	public function getLogs() {
		return $this->logs;
	}

	/**
	 * Adds a log to this deployment
	 *
	 * @param Log $log
	 * @return void
	 */
	public function addLog(Log $log) {
		$log->setDeployment($this);
		$this->logs->add($log);
	}

	/**
	 * @return integer
	 */
	public function getProject() {
		return $this->project;
	}

	/**
	 * @param integer $project
	 * @return Deployment
	 */
	public function setProject($project) {
		$this->project = $project;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getReference() {
		return $this->reference;
	}

	/**
	 * @param string $reference
	 * @return Deployment
	 */
	public function setReference($reference) {
		$this->reference = $reference;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getReferenceName() {
		return $this->referenceName;
	}

	/**
	 * @param string $referenceName
	 * @return Deployment
	 */
	public function setReferenceName($referenceName) {
		$this->referenceName = $referenceName;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getClientIp() {
		return $this->clientIp;
	}

	/**
	 * @param string $clientIp
	 * @return Deployment
	 */
	public function setClientIp($clientIp) {
		$this->clientIp = $clientIp;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getStatus() {
		return $this->status;
	}

	/**
	 * @param string $status
	 * @return Deployment
	 */
	public function setStatus($status) {
		$this->status = $status;
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
	 * @return Deployment
	 */
	public function setDate($date) {
		$this->date = $date;
		return $this;
	}

	/**
	 * @return array
	 */
	public function getConfiguration() {
		return $this->configuration;
	}

	/**
	 * @param array $server
	 * @return Deployment
	 */
	public function setConfiguration($configuration) {
		$this->configuration = $configuration;
		return $this;
	}

}