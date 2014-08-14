<?php
namespace Lightwerk\SurfCaptain\Utility;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class GeneralUtility {

	/**
	 * @param $repositoryUrl
	 * @return array
	 * @throws Exception
	 */
	static function getUrlPartsFromRepositoryUrl($repositoryUrl) {
		if (preg_match('/^((?<user>[^@]*)@)?(?<host>[^:]+)\:(?<path>.+)\.git$/', $repositoryUrl, $parts)) {
			return $parts;
		} else {
			throw new Exception('No valid repository url "' . $repositoryUrl . '"', 1407705569);
		}
	}
}