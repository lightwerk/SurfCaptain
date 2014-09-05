<?php
namespace Lightwerk\SurfCaptain;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Package\Package as BasePackage;

class Package extends BasePackage {

	/**
	 * Boot the package. We wire some signals to slots here.
	 *
	 * @param \TYPO3\Flow\Core\Bootstrap $bootstrap The current bootstrap
	 * @return void
	 */
	public function boot(\TYPO3\Flow\Core\Bootstrap $bootstrap) {
		$dispatcher = $bootstrap->getSignalSlotDispatcher();
		$dispatcher->connect(
			'Lightwerk\SurfCaptain\GitApi\ApiRequest', 'apiCall',
			'Lightwerk\SurfCaptain\GitApi\RequestListener', 'saveApiCall'
		);
		$dispatcher->connect(
			'Lightwerk\SurfCaptain\GitApi\ApiRequest', 'apiCall',
			'Lightwerk\SurfCaptain\GitApi\RequestListener', 'logApiCall'
		);
		$dispatcher->connect(
			'Lightwerk\SurfCaptain\GitApi\ApiRequest', 'beforeApiCall',
			'Lightwerk\SurfCaptain\GitApi\RequestListener', 'logBeforeApiCall'
		);
	}

}
