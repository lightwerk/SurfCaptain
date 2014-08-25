<?php
namespace Lightwerk\SurfCaptain\Utility;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Marker Utility
 *
 * @package Lightwerk\SurfCaptain
 */
class MarkerUtility {

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
	 * @param string $prefix
	 * @return array
	 */
	static protected function getMarkers(array $variables, $prefix = '') {
		$markers = array();
		foreach ($variables as $key => $value) {
			if (is_scalar($value)) {
				$markers['{{' . $prefix . $key . '}}'] = $value;
			} elseif (is_array($value)) {
				$markers = array_merge($markers, self::getMarkers($value, $prefix . $key . '.'));
			}
		}
		return $markers;
	}
}