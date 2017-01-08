<?php
namespace Lightwerk\SurfCaptain\GitApi\Request;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\GitApi\ApiRequestInterface;

interface HttpAuthRequestInterface extends ApiRequestInterface
{

    /**
     * @param array $headers
     * @return void
     */
    public function setAuthorizationHeader(array $headers);
}
