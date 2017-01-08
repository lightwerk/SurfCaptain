<?php
namespace Lightwerk\SurfCaptain\Domain\Factory;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\GitApi\DriverComposite;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\CopyDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\SyncDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSyncDeployment;
use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Utility\Arrays;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 * @Flow\Scope("singleton")
 */
class DeploymentFactory
{
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
     * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\CopyDeployment
     * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
     * @throws \Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception
     * @throws \Lightwerk\SurfCaptain\GitApi\Exception
     */
    public function createFromCopyDeployment(CopyDeployment $copyDeployment)
    {
        $gitRepositoryDeployment = $copyDeployment->getGitRepositoryDeployment();
        $initSyncDeployment = $copyDeployment->getInitSyncDeployment();
        $gitRepositoryDeployment->setPresetKey($copyDeployment->getPresetKey());
        $initSyncDeployment->setPresetKey($copyDeployment->getPresetKey());
        $gitRepositoryConfiguration = $this->createFromGitRepositoryDeployment($gitRepositoryDeployment)->getConfiguration();
        $syncConfiguration = $this->createFromInitSyncDeployment($initSyncDeployment)->getConfiguration();
        $preset = Arrays::arrayMergeRecursiveOverrule(
            $syncConfiguration,
            $gitRepositoryConfiguration
        );
        $postset = [];
        $postset['applications'][0]['type'] = $copyDeployment->getDeploymentType();
        $configuration = Arrays::arrayMergeRecursiveOverrule($preset, $postset);
        return $this->createFromConfiguration($configuration);
    }

    /**
     * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment
     * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
     * @throws \Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception
     * @throws \Lightwerk\SurfCaptain\GitApi\Exception
     */
    public function createFromGitRepositoryDeployment(GitRepositoryDeployment $gitRepositoryDeployment)
    {
        $preset = $this->presetRepository->findByIdentifier($gitRepositoryDeployment->getPresetKey());
        $postset = [];
        if ($gitRepositoryDeployment->getContext() !== '') {
            $postset['applications'][0]['options']['context'] = $gitRepositoryDeployment->getContext();
        }
        if ($gitRepositoryDeployment->getDeploymentPath() !== '') {
            $postset['applications'][0]['options']['deploymentPath'] = $gitRepositoryDeployment->getDeploymentPath();
        }
        if ($gitRepositoryDeployment->getSha() !== '') {
            $postset['applications'][0]['options']['sha1'] = $gitRepositoryDeployment->getSha();
        } elseif ($gitRepositoryDeployment->getTag() !== '') {
            $postset['applications'][0]['options']['tag'] = $gitRepositoryDeployment->getTag();
        } else {
            $postset['applications'][0]['options']['branch'] = $gitRepositoryDeployment->getBranch();
        }
        $postset['applications'][0]['type'] = $gitRepositoryDeployment->getDeploymentType();
        $configuration = Arrays::arrayMergeRecursiveOverrule($preset, $postset);
        return $this->createFromConfiguration($configuration);
    }

    /**
     * @param array
     * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
     */
    protected function createFromConfiguration($configuration)
    {
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

    /**
     * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSyncDeployment
     * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
     * @throws \Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception
     * @throws \Lightwerk\SurfCaptain\GitApi\Exception
     */
    public function createFromInitSyncDeployment(InitSyncDeployment $initSyncDeployment)
    {
        $deployment = $this->createFromSyncDeployment($initSyncDeployment);
        $preset = $deployment->getConfiguration();
        $postset = [];
        $postset['applications'][0]['options']['db']['credentialsSource'] = '';
        $postset['applications'][0]['options']['db']['host'] = $initSyncDeployment->getHost();
        $postset['applications'][0]['options']['db']['user'] = $initSyncDeployment->getUser();
        $postset['applications'][0]['options']['db']['password'] = $initSyncDeployment->getPassword();
        $database = $initSyncDeployment->getDatabase();
        if ($database === '') {
            // create from path
            // /data/www/typo3cms/dev/htdocs -> typo3cms_dev
            $deploymentPath = $preset['applications'][0]['options']['deploymentPath'];
            $project = array_slice(explode(DIRECTORY_SEPARATOR, $deploymentPath), -4, 1);
            $sub = array_slice(explode(DIRECTORY_SEPARATOR, $deploymentPath), -3, 1);
            $database = preg_replace(
                '/[^a-z0-9_]/',
                '',
                strtolower(array_pop($project))
            ) . '_' . preg_replace('/[^a-z0-9_]/', '', strtolower(array_pop($sub)));
        }
        $postset['applications'][0]['options']['db']['database'] = $database;
        $configuration = Arrays::arrayMergeRecursiveOverrule($preset, $postset);
        $deployment->setStaticConfiguration($configuration);
        return $deployment;
    }

    /**
     * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\SyncDeployment
     * @return \Lightwerk\SurfCaptain\Domain\Model\Deployment
     * @throws \Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception
     * @throws \Lightwerk\SurfCaptain\GitApi\Exception
     */
    public function createFromSyncDeployment(SyncDeployment $syncDeployment)
    {
        $sourcePreset = $this->presetRepository->findByIdentifier($syncDeployment->getSourcePresetKey());
        $preset = $this->presetRepository->findByIdentifier($syncDeployment->getPresetKey());
        if ($preset['applications'][0]['options']['context'] === 'Production') {
            throw new Exception('Sync Deployment to Production Context is not allowed.');
        }
        $postset = [];
        if (empty($preset['applications'][0]['options']['db']) === true) {
            $postset['applications'][0]['options']['db']['credentialsSource'] = 'TYPO3\\CMS';
        }
        $postset['applications'][0]['options']['sourceNode'] = $sourcePreset['applications'][0]['nodes'][0];
        $postset['applications'][0]['options']['sourceNodeOptions']['deploymentPath'] = $sourcePreset['applications'][0]['options']['deploymentPath'];
        $postset['applications'][0]['options']['sourceNodeOptions']['context'] = $sourcePreset['applications'][0]['options']['context'];
        if (empty($sourcePreset['applications'][0]['options']['db']) === true) {
            $postset['applications'][0]['options']['sourceNodeOptions']['db']['credentialsSource'] = 'TYPO3\\CMS';
        } else {
            $postset['applications'][0]['options']['sourceNodeOptions']['db'] = $sourcePreset['applications'][0]['options']['db'];
        }
        $postset['applications'][0]['type'] = $syncDeployment->getDeploymentType();
        $configuration = Arrays::arrayMergeRecursiveOverrule($preset, $postset);
        if (empty($configuration['applications'][0]['options']['repositoryUrl']) === true) {
            $configuration['applications'][0]['options']['repositoryUrl'] = $sourcePreset['applications'][0]['options']['repositoryUrl'];
        }

        if ($syncDeployment->getOverrideTargetDeploymentPath() !== '') {
            $configuration['applications'][0]['options']['deploymentPath'] = $syncDeployment->getOverrideTargetDeploymentPath();
        }
        if ($syncDeployment->getOverrideTargetSharedPath() !== '') {
            $configuration['applications'][0]['nodes'][0]['sharedPath'] = $syncDeployment->getOverrideTargetSharedPath();
        }
        if ($syncDeployment->getOverrideSourceDeploymentPath() !== '') {
            $configuration['applications'][0]['options']['sourceNodeOptions']['deploymentPath'] = $syncDeployment->getOverrideSourceDeploymentPath();
        }
        if ($syncDeployment->getOverrideSourceSharedPath() !== '') {
            $configuration['applications'][0]['options']['sourceNode']['sharedPath'] = $syncDeployment->getOverrideSourceSharedPath();
        }
        if ($syncDeployment->getUseSourceTaskOptions() === true && empty($sourcePreset['applications'][0]['taskOptions']) === false) {
            $configuration['applications'][0]['taskOptions'] = $sourcePreset['applications'][0]['taskOptions'];
        }

        return $this->createFromConfiguration($configuration);
    }
}
