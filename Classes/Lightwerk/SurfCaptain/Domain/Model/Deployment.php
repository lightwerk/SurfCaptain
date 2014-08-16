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

	const STATUS_WAITING = 'waiting';
	const STATUS_CANCELLED = 'cancelled';
	const STATUS_RUNNING = 'running';
	const STATUS_SUCCESS = 'success';
	const STATUS_FAILED = 'failed';

	/**
	 * @var \Doctrine\Common\Collections\Collection<\Lightwerk\SurfCaptain\Domain\Model\Log>
	 * @ORM\OneToMany(mappedBy="deployment")
	 * @ORM\OrderBy({"date" = "DESC"})
	 */
	protected $logs;

	/**
	 * @var string
	 */
	protected $repositoryUrl;

	/**
	 * @var string
	 * @ORM\Column(length=80)
	 */
	protected $referenceName;

	/**
	 * @var string
	 * @ORM\Column(length=15)
	 */
	protected $clientIp;

	/**
	 * @var string
	 */
	protected $status = 'waiting';

	/**
	 * @var \DateTime
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
		$this->setDate(new \DateTime());

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
	 * Returns RepositoryUrl
	 *
	 * @return string
	 */
	public function getRepositoryUrl() {
		return $this->repositoryUrl;
	}

	/**
	 * Sets RepositoryUrl
	 *
	 * @param string $repositoryUrl
	 * @return Deployment
	 */
	public function setRepositoryUrl($repositoryUrl) {
		$this->repositoryUrl = $repositoryUrl;
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
		// ToDo: Check if status is valid
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
	 * @param array $configuration
	 * @return Deployment
	 */
	public function setConfiguration($configuration) {
		if (!empty($configuration['applications'][0]['options'])) {
			$options = $configuration['applications'][0]['options'];
			if (!empty($options['repositoryUrl'])) {
				$this->setRepositoryUrl($options['repositoryUrl']);
			}
			if (!empty($options['sha1'])) {
				$this->setReferenceName('Sha1: ' . $options['ref']);
			} elseif (!empty($options['tag'])) {
				$this->setReferenceName('Tag: ' . $options['tag']);
			} elseif (!empty($options['branch'])) {
				$this->setReferenceName('Branch: ' . $options['branch']);
			}
		}
		$this->configuration = $configuration;
		return $this;
	}

}