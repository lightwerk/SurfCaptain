<?php
namespace Lightwerk\SurfCaptain\Domain\Factory;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\GitApi\DriverComposite;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\SharedDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSharedDeployment;
use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use TYPO3\Flow\Annotations as Flow;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 * @Flow\Scope("singleton")
 */
class DeploymentFactory {

	/**
	 * @var \Lightwerk\SurfCaptain\GitApi\DriverComposite
	 * @Flow\Inject
	 */
	protected $driverComposite;

	/**
	 * @Flow\Inject
	 * @var \Lightwerk\SurfCaptain\Domain\Repository\Preset\RepositoryInterface
	 */
	protected $presetRepository;

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSharedDeployment
	 * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
	 * @throws \Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception
	 * @throws \Lightwerk\SurfCaptain\GitApi\Exception
	 */
	public function createFromInitSharedDeployment(InitSharedDeployment $initSharedDeployment) {
		$deployment = $this->createFromSharedDeployment($initSharedDeployment);
		$preset =  $deployment->getConfiguration();
		$postset = array();
		$postset['applications'][0]['options']['db']['credentialsSource'] = '';
		$postset['applications'][0]['options']['db']['host'] = $initSharedDeployment->getHost();
		$postset['applications'][0]['options']['db']['user'] = $initSharedDeployment->getUser();
		$postset['applications'][0]['options']['db']['password'] = $initSharedDeployment->getPassword();
		$database = $initSharedDeployment->getDatabase();
		if ($database === '') {
			// create from path
			// /data/www/typo3cms/dev/htdocs -> typo3cms_dev
			$deploymentPath = $preset['applications'][0]['options']['deploymentPath'];
			$project = array_slice(explode(DIRECTORY_SEPARATOR, $deploymentPath), -4, 1);
			$sub = array_slice(explode(DIRECTORY_SEPARATOR, $deploymentPath), -3, 1);
			$database = preg_replace('/[^a-z0-9_]/', '', strtolower(array_pop($project))) . '_' . preg_replace('/[^a-z0-9_]/', '', strtolower(array_pop($sub)));
		}
		$postset['applications'][0]['options']['db']['database'] = $database;
		$configuration = \TYPO3\Flow\Utility\Arrays::arrayMergeRecursiveOverrule($preset, $postset);
		$deployment->setStaticConfiguration($configuration);
		return $deployment;
	}

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\SharedDeployment
	 * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
	 * @throws \Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception
	 * @throws \Lightwerk\SurfCaptain\GitApi\Exception
	 */
	public function createFromSharedDeployment(SharedDeployment $sharedDeployment) {
		$sourcePreset =  $this->presetRepository->findByIdentifier($sharedDeployment->getSourcePresetKey());
		$preset =  $this->presetRepository->findByIdentifier($sharedDeployment->getTargetPresetKey());
		$postset = array();
		$postset['applications'][0]['options']['db']['credentialsSource'] = 'TYPO3\\CMS';
		$postset['applications'][0]['options']['sourceNode'] = $sourcePreset['applications'][0]['nodes'][0];
		$postset['applications'][0]['options']['sourceNodeOptions']['deploymentPath'] = $sourcePreset['applications'][0]['options']['deploymentPath'];
		$postset['applications'][0]['options']['sourceNodeOptions']['context'] = $sourcePreset['applications'][0]['options']['context'];
		$postset['applications'][0]['options']['sourceNodeOptions']['db']['credentialsSource'] = 'TYPO3\\CMS';
		$postset['applications'][0]['type'] = 'TYPO3\\CMS\\Shared';
		$configuration = \TYPO3\Flow\Utility\Arrays::arrayMergeRecursiveOverrule($preset, $postset);
		return $this->createFromConfiguration($configuration);
	}

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment
	 * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
	 * @throws \Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception
	 * @throws \Lightwerk\SurfCaptain\GitApi\Exception
	 */
	public function createFromGitRepositoryDeployment(GitRepositoryDeployment $gitRepositoryDeployment) {
		$preset =  $this->presetRepository->findByIdentifier($gitRepositoryDeployment->getPresetKey());
		$postset = array();
		if ($gitRepositoryDeployment->getSha() !== '') {
			$postset['applications'][0]['options']['sha1'] = $gitRepositoryDeployment->getSha();
		} elseif ($gitRepositoryDeployment->getTag() !== '') {
			$postset['applications'][0]['options']['tag'] = $gitRepositoryDeployment->getTag();
		} else {
			$postset['applications'][0]['options']['branch'] = $gitRepositoryDeployment->getBranch();
		}
		$postset['applications'][0]['type'] = $gitRepositoryDeployment->getDeploymentType();
		$configuration = \TYPO3\Flow\Utility\Arrays::arrayMergeRecursiveOverrule($preset, $postset);
		return $this->createFromConfiguration($configuration);
	}

	/**
	 * @param array
	 * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
	 */
	protected function createFromConfiguration($configuration) {
		$repositoryUrl = $configuration['applications'][0]['options']['repositoryUrl'];
		$repository = $this->driverComposite->getRepository($repositoryUrl);
		$deployment = new Deployment();
		$deployment->setRepositoryIdentifier($repository->getIdentifier());
		$deployment->setRepositoryUrl($repositoryUrl);
		$deployment->setStaticConfiguration($configuration);
		// throw the clientIp away?
		$deployment->setClientIp('');
		return $deployment;
	}

}
