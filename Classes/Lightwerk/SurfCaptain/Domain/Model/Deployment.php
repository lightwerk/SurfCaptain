<?php
namespace Lightwerk\SurfCaptain\Domain\Model;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
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
	 */
	protected $repositoryIdentifier;

	/**
	 * @var Repository
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
	 * Constructs a new Deployment
	 */
	public function __construct() {
		$this->logs = new \Doctrine\Common\Collections\ArrayCollection();
		$this->setDate(new \DateTime());
		$this->setStatus(self::STATUS_WAITING);
	}

	/**
	 * @return \Doctrine\Common\Collections\Collection<\Lightwerk\SurfCaptain\Domain\Model\Log>
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
		} else {
			return '';
		}
	}

	/**
	 * @return string
	 */
	public function getReferenceName() {
		$configuration = $this->getConfiguration();
		if (empty($configuration['applications'][0]['options'])) {
			return '';
		}
		$options = $configuration['applications'][0]['options'];
		if (!empty($options['sha1'])) {
			return 'Sha1: ' . $options['ref'];
		} elseif (!empty($options['tag'])) {
			return 'Tag: ' . $options['tag'];
		} elseif (!empty($options['branch'])) {
			return 'Branch: ' . $options['branch'];
		}
		return '';
	}

	/**
	 * @return string
	 */
	public function getContext() {
		$configuration = $this->getConfiguration();
		if (empty($configuration['applications'][0]['options']['context'])) {
			return '';
		} else {
			return $configuration['applications'][0]['options']['context'];
		}
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
		if (!empty($configuration['applications'][0]['options']['repositoryUrl'])) {
			$this->setRepositoryUrl($configuration['applications'][0]['options']['repositoryUrl']);

			$repository = $this->getRepository();
			if (!empty($repository)) {
				$this->setRepositoryIdentifier($repository->getIdentifier());
			}
		}
		$this->configuration = $configuration;
		return $this;
	}

	/**
	 * @return Repository|boolean
	 */
	public function getRepository() {
		if ($this->repository === NULL) {
			$repositoryUrl = $this->getRepositoryUrl();
			if (!empty($repositoryUrl)) {
				$gitService = new GitService();
				try {
					$this->repository = $gitService->getRepository($repositoryUrl);
				} catch (\Exception $e) {
					$this->repository = FALSE;
				}
			}
		}
		return $this->repository;
	}

}