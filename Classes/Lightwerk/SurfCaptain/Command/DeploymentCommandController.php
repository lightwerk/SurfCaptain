<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\CopyDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\SyncDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSyncDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;

/**
 * @package Lightwerk.SurfCaptain
 * @author Achim Fritz <af@lightwerk.com> 
 */
class DeploymentCommandController extends \TYPO3\Flow\Cli\CommandController {

	/**
	 * @Flow\Inject
	 * @var \Lightwerk\SurfCaptain\Domain\Repository\Preset\RepositoryInterface
	 */
	protected $presetRepository;

	/**
	 * @FLow\Inject
	 * @var DeploymentRepository
	 */
	protected $deploymentRepository;

	/**
	 * @var \TYPO3\Flow\Persistence\Doctrine\PersistenceManager
	 * @Flow\Inject
	 */
	protected $persistenceManager;

	/**
	 * @Flow\Inject
	 * @var \Lightwerk\SurfCaptain\Domain\Factory\DeploymentFactory
	 */
	protected $deploymentFactory;

	/**
	 * @param integer $limit
	 * @return void
	 */
	public function listCommand($limit = 50) {
		$deployments =  $this->deploymentRepository->findAllWithLimit($limit);
		foreach ($deployments as $deployment) {
			$this->outputLine(
				$this->persistenceManager->getIdentifierByObject($deployment) . ' ' . 
				$deployment->getDate()->format('d.m.Y H:i') . ' ' . 
				$deployment->getRepositoryIdentifier() . ' ' . 
				$deployment->getStatus()
			);
		}
	}

	/**
	 * @param integer $daysOld
	 * @return void
	 */
	public function deleteOldCommand($daysOld) {
		$deployments = $this->deploymentRepository->findByDaysOld($daysOld);
		if (count($deployments) > 0) {
			foreach ($deployments AS $deployment) {
				$this->deploymentRepository->remove($deployment);
				$this->outputLine('deployment removed');
			}
		} else {
			$this->outputLine('no deployments found');
		}
	}

	/**
	 * @param string $identifier 
	 * @return void
	 */
	public function deleteCommand($identifier) {
		$deployment = $this->persistenceManager->getObjectByIdentifier($identifier, 'Lightwerk\SurfCaptain\Domain\Model\Deployment');
		if ($deployment instanceof Deployment) {
			$this->deploymentRepository->remove($deployment);
			$this->outputLine('deployment removed');
		} else {
			$this->outputLine('no deployment found');
		}
	}

	/**
	 * @param string $identifier 
	 * @return void
	 */
	public function showCommand($identifier) {
		$deployment = $this->persistenceManager->getObjectByIdentifier($identifier, 'Lightwerk\SurfCaptain\Domain\Model\Deployment');
		if ($deployment instanceof Deployment) {
			$configuration = $deployment->getConfiguration();
			$this->outputLine(print_r($configuration, TRUE));
		} else {
			$this->outputLine('no deployment found');
		}
	}

	/**
	 * @param string $key 
	 * @param string $type
	 * @param string $context 
	 * @param string $branch 
	 * @return void
	 */
	public function createCommand($key, $type = 'TYPO3\\CMS\\Deploy', $context='Development', $branch='master') {
		$deployment = new Deployment();
		$deployment->setClientIp('127.0.0.1');
		try {
			$preset =  $this->presetRepository->findByIdentifier($key);
		} catch (\Lightwerk\Surfcaptain\Exception $e) {
			$this->outputLine('cannot get preset');
			$this->quit();
		}
		$preset['applications'][0]['options']['branch'] = $branch;
		$preset['applications'][0]['options']['context'] = $context;
		$preset['applications'][0]['type'] = $type;
		if ($deployment->getRepository() !== NULL) {
			$this->deploymentRepository->add($deployment);
			$this->outputLine('SUCCESS: deployment created');
		} else {
			$this->outputLine('ERROR: no repository');
		}
	}

	/**
	 * @param string $presetKey 
	 * @param string $type
	 * @return void
	 */
	public function createCopyDeploymentCommand($sourcePresetKey, $targetPresetKey) {
		$initSyncDeployment = new InitSyncDeployment();
		$initSyncDeployment->setSourcePresetKey($sourcePresetKey);
		$gitRepositoryDeployment = new GitRepositoryDeployment();
		$copyDeployment = new CopyDeployment();
		$copyDeployment->setPresetKey($targetPresetKey);
		$copyDeployment->setInitSyncDeployment($initSyncDeployment);
		$copyDeployment->setGitRepositoryDeployment($gitRepositoryDeployment);
		try {
			$deployment = $this->deploymentFactory->createFromCopyDeployment($copyDeployment);
			$this->deploymentRepository->add($deployment);
			$this->outputLine('OK: deployment added');
		} catch (\Lightwerk\SurfCaptain\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		}
	}

	/**
	 * @param string $presetKey 
	 * @param string $type
	 * @param string $branch
	 * @return void
	 */
	public function createGitRepositoryDeploymentCommand($presetKey, $type = 'TYPO3\\CMS\\Deploy', $branch = 'master') {
		$gitRepositoryDeployment = new GitRepositoryDeployment();
		$gitRepositoryDeployment->setPresetKey($presetKey);
		$gitRepositoryDeployment->setDeploymentType($type);
		$gitRepositoryDeployment->setBranch($branch);
		try {
			$deployment = $this->deploymentFactory->createFromGitRepositoryDeployment($gitRepositoryDeployment);
			$this->deploymentRepository->add($deployment);
			$this->outputLine('OK: deployment added');
		} catch (\Lightwerk\SurfCaptain\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		}
	}

	/**
	 * @param string $presetKey 
	 * @param string $type
	 * @return void
	 */
	public function createSyncDeploymentCommand($sourcePresetKey, $targetPresetKey, $type = 'TYPO3\\CMS\\Sync') {
		$syncDeployment = new SyncDeployment();
		$syncDeployment->setSourcePresetKey($sourcePresetKey);
		$syncDeployment->setPresetKey($targetPresetKey);
		try {
			$deployment = $this->deploymentFactory->createFromSyncDeployment($syncDeployment);
			$this->deploymentRepository->add($deployment);
			$this->outputLine('OK: deployment added');
		} catch (\Lightwerk\SurfCaptain\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		}
	}

	/**
	 * @param string $presetKey 
	 * @param string $type
	 * @return void
	 */
	public function createInitSyncDeploymentCommand($sourcePresetKey, $targetPresetKey) {
		$initSyncDeployment = new InitSyncDeployment();
		$initSyncDeployment->setSourcePresetKey($sourcePresetKey);
		$initSyncDeployment->setPresetKey($targetPresetKey);
		try {
			$deployment = $this->deploymentFactory->createFromInitSyncDeployment($initSyncDeployment);
			$this->deploymentRepository->add($deployment);
			$this->outputLine('OK: deployment added');
		} catch (\Lightwerk\SurfCaptain\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		}
	}

}
