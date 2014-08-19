<?php
namespace Lightwerk\SurfCaptain\Mapper;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use Lightwerk\SurfCaptain\Utility\MarkerUtility;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Reflection\ObjectAccess;

/**
 * @Flow\Scope("singleton")
 */
class DataMapper {

	/**
	 * @param array $objectData
	 * @param string $objectClass
	 * @return object
	 */
	public function mapToObject(array $objectData, $objectClass, array $settings) {
		if (preg_match('/^(.+)\[\]$/', $objectClass, $matches)) {
			$objectClass = $matches[1];
			$objects = array();
			foreach ($objectData as $objectRow) {
				$objects[] = $this->mapOneToObject($objectRow, $objectClass, $settings);
			}
			return $objects;
		} else {
			return $this->mapOneToObject($objectData, $objectClass, $settings);
		}
	}

	/**
	 * @param array $objectData
	 * @param string $objectClass
	 * @param array $settings
	 * @return object
	 */
	protected function mapOneToObject($objectData, $objectClass, $settings) {
		if (!is_array($objectData)) {
			throw new Exception('Object mapping is not possible with given unexpected data: ' . json_encode($objectData), 1408468371);
		}
		if (!class_exists($objectClass)) {
			throw new Exception('Object class "' . $objectClass . '" does not exist!', 1408203711);
		}
		$object = new $objectClass();
		$properties = $propertyNames = ObjectAccess::getSettablePropertyNames($object);
		foreach ($properties as $property) {
			$value = $this->getPropertyValue($object, $property, $objectData, $settings);
			if (isset($value)) {
				$setterName = ObjectAccess::buildSetterMethodName($property);
				$object->$setterName($value);
			}
		}
		return $object;
	}

	/**
	 * @param string $propertyName
	 * @param mixed $value
	 * @param mixed $object
	 * @param array $settings
	 * @return mixed
	 */
	protected function getPropertyValue($object, $property, $objectData, $settings) {
		$value = NULL;

		// Value is configured by settings
		$modelName = $this->getModelName($object);
		if (isset($settings[$modelName][$property])) {
			$value = MarkerUtility::replaceVariablesInValue(
				$settings[$modelName][$property],
				$objectData
			);
		}
		// Name is in convention. Map it automatically
		else {
			$dataKeys = array(
				$property,
				GeneralUtility::camelCaseToLowerCaseUnderscored($property)
			);
			foreach ($dataKeys as $key) {
				if (isset($objectData[$key])) {
					$value = $objectData[$key];
					break;
				}
			}
		}

		// Is value an object? If yes, then render it as object
		if (is_array($value)) {
			$className = 'Lightwerk\\SurfCaptain\\Domain\\Model\\' . ucfirst($property);
			if (class_exists($className)) {
				$value = $this->mapToObject($value, $className, $settings);
			}
		}

		return $value;
	}

	/**
	 * @param string $object
	 * @return string
	 */
	protected function getModelName($object) {
		$modelName = get_class($object);
		if (preg_match('/([^\\\]+)$/', $modelName, $matches)) {
			$modelName = $matches[1];
		}
		return $modelName;
	}
}