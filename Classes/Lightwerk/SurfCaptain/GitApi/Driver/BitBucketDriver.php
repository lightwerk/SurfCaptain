<?php
namespace Lightwerk\SurfCaptain\GitApi\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Repository;
use TYPO3\Flow\Annotations as Flow;

/**
 * GitLab Driver
 *
 * @package Lightwerk\SurfCaptain
 */
class BitBucketDriver extends AbstractDriver
{
    /**
     * @param array $settings
     * @return void
     */
    public function setSettings(array $settings)
    {
        $this->settings = $settings;
        $this->apiRequest = $this->objectManager->get('Lightwerk\SurfCaptain\GitApi\Request\OAuthRequestInterface');
        $this->apiRequest->setOAuthClient(
            $settings['privateToken'],
            $settings['privateSecret'],
            $settings['accessToken'],
            $settings['accessSecret']
        );
    }

    /**
     * @param string $repositoryUrl
     * @return boolean
     */
    public function hasRepository($repositoryUrl)
    {
        return $this->getGitVendorFromRepositoryUrl($repositoryUrl) === 'git@bitbucket.org';
    }

    /**
     * @return array
     */
    public function getRepositories()
    {
        $repositories = [];
        foreach ($this->settings['repositories'] as $command) {
            $this->apiRequest->setApiUrl($this->settings['apiUrl']);
            $response = $this->apiRequest->call($command . '?pagelen=100');
            $projects = $response['values'];
            $repositories = array_merge(
                $repositories,
                $this->dataMapper->mapToObject(
                    $projects,
                    '\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository[]',
                    !empty($this->settings['mapping']) ? $this->settings['mapping'] : []
                )
            );
        }
        return $repositories;
    }

    /**
     * @param string $repositoryUrl
     * @param string $filePath
     * @param string $reference branch name, tag name or hash
     * @return string
     * @throws Exception
     */
    public function getFileContent($repositoryUrl, $filePath, $reference = 'master')
    {
        $name = $this->getRepositoryName($repositoryUrl);
        $name = urlencode($name);
        $command = 'repositories/' . $this->settings['accountName'] . '/' . $name . '/raw/' . $reference . '/' . $filePath;
        $this->apiRequest->setApiUrl($this->settings['fallbackApiUrl']);
        $response = $this->apiRequest->call($command);
        return json_encode($response);
    }

    /**
     * @param string $repositoryUrl
     * @return string
     */
    protected function getRepositoryName($repositoryUrl)
    {
        $parts = explode('/', $repositoryUrl);
        return str_replace('.git', '', array_pop($parts));
    }

    /**
     * @param string $repositoryUrl
     * @param string $filePath
     * @param string $content
     * @param string $commitMessage
     * @param string $branchName
     * @return void
     * @throws Exception
     */
    public function setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName = 'master')
    {
        throw new Exception('Bitbucket does not support writing of files through the API.', 1423472111);
    }

    /**
     * @param string $repositoryUrl
     * @return Repository
     */
    public function getRepository($repositoryUrl)
    {
        $name = $this->getRepositoryName($repositoryUrl);
        $name = urlencode($name);
        $this->apiRequest->setApiUrl($this->settings['apiUrl']);
        $command = 'repositories/' . $this->settings['accountName'] . '/' . $name;
        $response = $this->apiRequest->call($command);
        $repository = $this->dataMapper->mapToObject(
            $response,
            '\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository',
            $this->settings['mapping']
        );

        $this->apiRequest->setApiUrl($this->settings['fallbackApiUrl']);

        // branches
        $response = $this->apiRequest->call($command . '/branches');
        $branches = $this->dataMapper->mapToObject(
            $response,
            '\\Lightwerk\\SurfCaptain\\Domain\\Model\\Branch[]',
            $this->settings['mapping']
        );
        $repository->setBranches($branches);

        // tags
        $response = $this->apiRequest->call($command . '/tags');
        $tags = $this->dataMapper->mapToObject(
            $response,
            '\\Lightwerk\\SurfCaptain\\Domain\\Model\\Tag[]',
            $this->settings['mapping']
        );
        $repository->setTags($tags);

        return $repository;
    }
}
