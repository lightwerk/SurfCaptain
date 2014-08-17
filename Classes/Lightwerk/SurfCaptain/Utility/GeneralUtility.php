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

	/**
	 * Returns a given CamelCasedString as an lowercase string with underscores.
	 * Example: Converts BlogExample to blog_example, and minimalValue to minimal_value
	 *
	 * @param string $string String to be converted to lowercase underscore
	 * @return string lowercase_and_underscored_string
	 */
	static public function camelCaseToLowerCaseUnderscored($string) {
		return strtolower(preg_replace('/(?<=\\w)([A-Z])/', '_\\1', $string));
	}
}