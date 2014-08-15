<?php
namespace Lightwerk\SurfCaptain\Mapper;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class DataMapper {

	/**
	 * @param array $objectData
	 * @param string $objectClass
	 * @return object
	 */
	public function mapToObject(array $objectData, $objectClass) {
		return $objectData;
	}
}