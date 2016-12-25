<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

interface ApiRequestInterface
{
    /**
     * @param string $apiUrl
     * @return void
     */
    public function setApiUrl($apiUrl);

    /**
     * @param string $command
     * @param string $method
     * @param array $parameters
     * @return mixed $data
     * @throws Exception
     * @throws \TYPO3\Flow\Http\Exception
     */
    public function call($command, $method = 'GET', array $parameters = [], array $content = []);
}
