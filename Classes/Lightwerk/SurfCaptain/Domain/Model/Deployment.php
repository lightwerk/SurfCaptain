<?php
namespace Lightwerk\SurfCaptain\Domain\Model;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Lightwerk\SurfCaptain\GitApi\DriverComposite;
use TYPO3\Flow\Annotations as Flow;

/**
 * Deployment
 *
 * @package Lightwerk\SurfCaptain
 * @Flow\Entity
 */
class Deployment {

	const STATUS_WAITING = 'waiting';
	const STATUS_CANCELLED = 'cancelled';
	const STATUS_RUNNING = 'running';
	const STATUS_SUCCESS = 'success';
	const STATUS_FAILED = 'failed';

	/**
	 * @var Collection<\Lightwerk\SurfCaptain\Domain\Model\Log>
	 * @ORM\OneToMany(mappedBy="deployment")
	 * @ORM\OrderBy({"date" = "DESC"})
	 * @Flow\Lazy()
	 */
	protected $logs;

	/**
	 * @var string
	 */
	protected $repositoryUrl;

	/**
	 * @var string
	 */
	protected $repositoryIdentifier;

	/**
	 * @var Repository|boolean
	 * @Flow\Transient
	 */
	protected $repository;

	/**
	 * @var string
	 * @ORM\Column(length=15)
	 */
	protected $clientIp;

	/**
	 * @var string
	 */
	protected $status;

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
	 * @var DriverComposite
	 * @Flow\Inject
	 */
	protected $driverComposite;

	/**
	 * Constructs a new Deployment
	 */
	public function __construct() {
		$this->logs = new ArrayCollection();
		$this->setDate(new \DateTime());
		$this->setStatus(self::STATUS_WAITING);
	}

	/**
	 * @return Collection<\Lightwerk\SurfCaptain\Domain\Model\Log>
	 */
	public function getLogs() {
		return $this->logs;
	}

	/**
	 * @param Log $log
	 * @return void
	 */
	public function addLog(Log $log) {
		$log->setDeployment($this);
		$this->logs->add($log);
	}

	/**
	 * @return string
	 */
	public function getRepositoryUrl() {
		return $this->repositoryUrl;
	}

	/**
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
	public function getType() {
		$configuration = $this->getConfiguration();
		if (!empty($configuration['applications'][0]['type'])) {
			return $configuration['applications'][0]['type'];
		}
		return '';
	}

	/**
	 * Since sha1 is always shipped with branch and tag
	 * configuration, we consider it for referenceName
	 * only if neither tag nor branch was set.
	 *
	 * @return string
	 */
	public function getReferenceName() {
		$options = $this->getOptions();
		if (!empty($options['tag'])) {
			return 'Tag: ' . $options['tag'];
		} elseif (!empty($options['branch'])) {
			return 'Branch: ' . $options['branch'];
		} elseif (!empty($options['sha1'])) {
			return 'Sha1: ' . $options['sha1'];
		}
		return '';
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
	 * @return string
	 */
	public function getRepositoryIdentifier() {
		return $this->repositoryIdentifier;
	}

	/**
	 * @param string $repositoryIdentifier
	 * @return Deployment
	 */
	public function setRepositoryIdentifier($repositoryIdentifier) {
		$this->repositoryIdentifier = $repositoryIdentifier;
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
		$this->configuration = $configuration;
		$options = $this->getOptions();

		if (!empty($options['repositoryUrl'])) {
			$this->setRepositoryUrl($options['repositoryUrl']);
			$repository = $this->getRepository();
			if (!empty($repository)) {
				$this->setRepositoryIdentifier($repository->getIdentifier());
			}
		}

		return $this;
	}

	/**
	 * @return Repository|NULL
	 */
	public function getRepository() {
		// ToDo lw-lm: Find better way to do that (Flow/Inject annotation?)
		if ($this->repository === NULL) {
			$repositoryUrl = $this->getRepositoryUrl();
			if (!empty($repositoryUrl)) {
				try {
					$this->repository = $this->driverComposite->getRepository($repositoryUrl);
				} catch (\Exception $e) {
					$this->repository = FALSE;
				}
			}
		}
		return $this->repository ?: NULL;
	}

	/**
	 * @return array
	 */
	public function getOptions() {
		$options = array();
		$configuration = $this->getConfiguration();
		if (!empty($configuration['applications'][0]['options'])) {
			$options = array_merge($options, $configuration['applications'][0]['options']);
		}
		if (!empty($configuration['applications'][0]['nodes'][0])) {
			$options = array_merge($options, $configuration['applications'][0]['nodes'][0]);
		}
		return $options;
	}

}
