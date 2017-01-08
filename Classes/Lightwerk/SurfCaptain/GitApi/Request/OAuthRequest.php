<?php
namespace Lightwerk\SurfCaptain\GitApi\Request;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Response;
use Lightwerk\SurfCaptain\GitApi\Exception;

/**
 * Class BitbucketApiRequest
 *
 * @author Daniel Goerz <dlg@lightwerk.com>
 */
class OAuthRequest implements OAuthRequestInterface
{
    /**
     * @var \OAuth
     */
    protected $oAuthClient;

    /**
     * @var string
     */
    protected $apiUrl;

    /**
     * @param string $consumerKey
     * @param string $consumerSecret
     * @param string $accessToken
     * @param string $accessSecret
     * @return void
     * @throws Exception
     */
    public function setOAuthClient($consumerKey, $consumerSecret, $accessToken, $accessSecret)
    {
        if (!class_exists('OAuth')) {
            throw new Exception('The OAuth PHP module must be present to perform OAuth requests.', 1424003541);
        }
        $this->oAuthClient = new \OAuth($consumerKey, $consumerSecret);
        $this->oAuthClient->setToken($accessToken, $accessSecret);
    }

    /**
     * @param string $apiUrl
     * @return void
     */
    public function setApiUrl($apiUrl)
    {
        $this->apiUrl = $apiUrl;
    }

    /**
     * @param string $command
     * @param string $method
     * @param array $parameters
     * @param array $content
     * @return mixed $data
     * @throws Exception
     * @throws \TYPO3\Flow\Http\Exception
     */
    public function call($command, $method = 'GET', array $parameters = [], array $content = [])
    {
        $url = $this->apiUrl . $command;
        $this->emitBeforeApiCall($url, $method);
        try {
            $this->oAuthClient->fetch($url, $parameters, $method);
        } catch (\OAuthException $e) {
            // we get a 404 Response here, so lets process it
        }

        $response = $this->getResponse();
        $this->emitApiCall($url, $method, $response);
        $statusCode = $response->getStatusCode();

        if ($statusCode < 200 || $statusCode >= 400) {
            throw new Exception(
                'ApiRequest was not successful for command  ' . $command . ' Response was: ' . $response->getStatus(),
                1408987295
            );
        }

        $content = json_decode($response->getContent(), true);
        if ($content === null) {
            throw new Exception('Response from ApiRequest is not a valid json', 1408987294);
        }
        return $content;
    }

    /**
     * @param string $url
     * @param string $method
     * @return void
     * @Flow\Signal
     */
    protected function emitBeforeApiCall($url, $method)
    {
    }

    /**
     * @return Response
     */
    protected function getResponse()
    {
        $responseHeaders = $this->oAuthClient->getLastResponseHeaders();
        $response = Response::createFromRaw($responseHeaders);
        $response->appendContent($this->oAuthClient->getLastResponse());
        return $response;
    }

    /**
     * @param string $url
     * @param string $method
     * @param Response $response
     * @return void
     * @Flow\Signal
     */
    protected function emitApiCall($url, $method, Response $response)
    {
    }
}
