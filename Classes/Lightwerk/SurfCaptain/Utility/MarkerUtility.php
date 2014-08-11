<?php
namespace Lightwerk\SurfCaptain\Utility;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

class MarkerUtility {

	/**
	 * @param array $array
	 * @param string $variables
	 * @return array
	 */
	static public function replaceVariablesInArray(array $array, array $variables) {
		foreach ($array as $key => $value) {
			if (is_scalar($value)) {
				$array[$key] = self::replaceVariablesInValue($value, $variables);
			}
		}
		return $array;
	}

	/**
	 * @param string $value
	 * @param array $variables
	 * @return string
	 */
	static public function replaceVariablesInValue($value, array $variables) {
		$markers = self::getMarkers($variables);
		return str_replace(array_keys($markers), $markers, $value);
	}

	/**
	 * @param array $variables
	 * @return array
	 */
	static protected function getMarkers(array $variables) {
		$markers = array();
		foreach ($variables as $key => $value) {
			if (is_scalar($value)) {
				$markers['{{' . $key . '}}'] = $value;
			}
		}
		return $markers;
	}
}