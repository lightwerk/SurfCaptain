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
 * Data Mapper
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class DataMapper
{
    /**
     * @param array $objectData
     * @param string $objectClass
     * @param array $settings
     * @return object|array
     */
    public function mapToObject(array $objectData, $objectClass, array $settings)
    {
        if (preg_match('/^(.+)\[\]$/', $objectClass, $matches)) {
            $objectClass = $matches[1];
            $objects = [];
            foreach ($objectData as $key => $objectRow) {
                $objects[] = $this->mapOneToObject($objectRow, $objectClass, $settings, $key);
            }
            return $objects;
        }
        return $this->mapOneToObject($objectData, $objectClass, $settings);
    }

    /**
     * @param array $objectData
     * @param string $objectClass
     * @param array $settings
     * @param string $key
     * @return object
     * @throws Exception
     */
    protected function mapOneToObject($objectData, $objectClass, $settings, $key = '')
    {
        if (!is_array($objectData)) {
            throw new Exception(
                'Object mapping is not possible with given unexpected data for ObjectClass ' . $objectClass . ': ' . json_encode($objectData),
                1408468371
            );
        }
        $object = $this->getNewInstanceOfObject($objectClass);
        $properties = ObjectAccess::getSettablePropertyNames($object);
        foreach ($properties as $property) {
            $value = $this->getPropertyValue($object, $property, $objectData, $settings, $key);
            if (isset($value)) {
                $setterName = ObjectAccess::buildSetterMethodName($property);
                $object->$setterName($value);
            }
        }
        return $object;
    }

    /**
     * @param string $objectClass
     * @return mixed
     * @throws Exception
     */
    protected function getNewInstanceOfObject($objectClass)
    {
        if (!class_exists($objectClass)) {
            throw new Exception('Object class "' . $objectClass . '" does not exist!', 1408203711);
        }
        return new $objectClass();
    }

    /**
     * @param object $object
     * @param string $property
     * @param array $objectData
     * @param array $settings
     * @param string $key
     * @return mixed
     */
    protected function getPropertyValue($object, $property, $objectData, $settings, $key)
    {
        $value = null;

        // Value is configured by settings
        $modelName = $this->getModelName($object);
        if (isset($settings[$modelName][$property])) {
            if ($settings[$modelName][$property] === '{{_KEY_}}') {
                return $key;
            }
            if (is_array($settings[$modelName][$property])) {
                $value = [];
                foreach ($settings[$modelName][$property] as $key => $marker) {
                    $value[$key] = MarkerUtility::replaceVariablesInValue(
                        $marker,
                        $objectData
                    );
                }
            } else {
                $value = MarkerUtility::replaceVariablesInValue(
                    $settings[$modelName][$property],
                    $objectData
                );
            }
        } // Name is in convention. Map it automatically
        else {
            $dataKeys = [
                $property,
                GeneralUtility::camelCaseToLowerCaseUnderscored($property)
            ];
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
     * @param mixed $object
     * @return string
     */
    protected function getModelName($object)
    {
        $modelName = get_class($object);
        if (preg_match('/([^\\\]+)$/', $modelName, $matches)) {
            $modelName = $matches[1];
        }
        return $modelName;
    }
}
