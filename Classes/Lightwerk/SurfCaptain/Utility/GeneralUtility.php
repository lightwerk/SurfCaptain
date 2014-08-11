<?php
namespace Lightwerk\SurfCaptain\Utility;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class GeneralUtility {

	/**
	 * @param $array
	 * @param array|string $remove
	 * @return void
	 */
	static function arrayUnsetRecursive(&$array, $remove) {
		if (!is_array($remove)) $remove = array($remove);
		foreach ($array as $key => &$value) {
			if (in_array($value, $remove)) unset($array[$key]);
			else if (is_array($value)) {
				self::arrayUnsetRecursive($value, $remove);
			}
		}
	}

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