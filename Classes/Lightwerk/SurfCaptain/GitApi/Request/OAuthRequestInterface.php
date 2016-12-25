<?php
namespace Lightwerk\SurfCaptain\GitApi\Request;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\GitApi\ApiRequestInterface;

/**
 * Interface OAuthRequestInterface
 *
 * @author Daniel Goerz <dlg@lightwerk.com>
 */
interface OAuthRequestInterface extends ApiRequestInterface
{
    /**
     * @param string $consumerKey
     * @param string $consumerSecret
     * @param string $accessToken
     * @param string $accessSecret
     * @return void
     */
    public function setOAuthClient($consumerKey, $consumerSecret, $accessToken, $accessSecret);

    /**
     * @param string $apiUrl
     * @return void
     */
    public function setApiUrl($apiUrl);

    /**
     * @param string $command
     * @param string $method
     * @param array $parameters
     * @param array $content
     * @return mixed $data
     * @throws Exception
     * @throws \TYPO3\Flow\Http\Exception
     */
    public function call($command, $method = 'GET', array $parameters = [], array $content = []);
}
