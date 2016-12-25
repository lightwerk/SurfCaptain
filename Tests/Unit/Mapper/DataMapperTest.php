<?php
namespace Lightwerk\SurfCaptain\Tests\Unit\Mapper;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Tests\UnitTestCase;

/**
 * DriverCompositeTest
 *
 * @package Lightwerk\SurfCaptain
 * @author Daniel Goerz <dlg@lightwerk.com>
 */
class DataMapperTest extends UnitTestCase
{
    /**
     * @test
     * @return void
     */
    public function getModelNameReturnsLastPartOfClassNameAsString()
    {
        $dataMapperMock = $this->getAccessibleMock('Lightwerk\SurfCaptain\Mapper\DataMapper', ['foo']);
        $object = new \Lightwerk\SurfCaptain\Tests\Unit\Mapper\DataMapperTest();
        $className = $dataMapperMock->_call('getModelName', $object);
        $this->assertSame('DataMapperTest', $className);
    }

    /**
     * @test
     * @return void
     */
    public function getPropertyValueReturnsKey()
    {
        $dataMapperMock = $this->getAccessibleMock('Lightwerk\SurfCaptain\Mapper\DataMapper', ['getModelName']);
        $settings = [
            'model' => [
                'property' => '{{_KEY_}}'
            ]
        ];
        $keyValue = 'keyValue';
        $dataMapperMock->expects($this->once())->method('getModelName')->will($this->returnValue('model'));
        $value = $dataMapperMock->_call('getPropertyValue', new \stdClass(), 'property', [], $settings, $keyValue);
        $this->assertSame($keyValue, $value);
    }

    /**
     * @return void
     * @test
     * @dataProvider getPropertyDataProvider
     */
    public function getPropertyReturnsValueAfterMappingWasPerformed($objectData, $settings, $expectation)
    {
        $dataMapperMock = $this->getAccessibleMock('Lightwerk\SurfCaptain\Mapper\DataMapper', ['getModelName']);
        $dataMapperMock->expects($this->once())->method('getModelName')->will($this->returnValue('model'));
        $value = $dataMapperMock->_call('getPropertyValue', new \stdClass(), 'myProperty', $objectData, $settings,
            'keyValue');
        $this->assertSame($expectation, $value);
    }

    /**
     * Data provider for getPropertyReturnsValueAfterMappingWasPerformed
     *
     * @return array
     */
    public function getPropertyDataProvider()
    {
        return [
            'Mapping simple property of model.' => [
                // $objectData
                [
                    'some_mapping' => 'fooBar'
                ],
                // $settings
                [
                    'model' => [
                        'myProperty' => '{{some_mapping}}'
                    ]
                ],
                // $expectation
                'fooBar'
            ],
            'Mapping array in property of model.' => [
                [
                    'some_mapping' => 'fooBar',
                    'some_other_mapping' => 'foo'
                ],
                [
                    'model' => [
                        'myProperty' => [
                            'propertyA' => '{{some_mapping}}',
                            'propertyB' => '{{some_other_mapping}}'
                        ]
                    ]
                ],
                [
                    'propertyA' => 'fooBar',
                    'propertyB' => 'foo'
                ]
            ],
            'No Mapping. Key is found in $objectData' => [
                [
                    'myProperty' => 'fooBar',
                ],
                [],
                'fooBar'
            ],
            'No Mapping. Transformed key is found in $objectData' => [
                [
                    'my_property' => 'fooBar',
                ],
                [],
                'fooBar'
            ]
        ];
    }

    /**
     * @return void
     * @test
     * @expectedException \Lightwerk\SurfCaptain\Mapper\Exception
     */
    public function getNewInstanceOfObjectThrowsExceptionIfObjectClassDoesNotExist()
    {
        $dataMapperMock = $this->getAccessibleMock('Lightwerk\SurfCaptain\Mapper\DataMapper', ['foo']);
        $dataMapperMock->_call('getNewInstanceOfObject', 'nonexistingClassName');
    }

    /**
     * @return void
     * @test
     */
    public function getNewInstanceOfObjectReturnsInstanceOfObject()
    {
        $dataMapperMock = $this->getAccessibleMock('Lightwerk\SurfCaptain\Mapper\DataMapper', ['foo']);
        $object = $dataMapperMock->_call('getNewInstanceOfObject',
            'Lightwerk\SurfCaptain\Tests\Unit\Mapper\DataMapperTest');
        $this->assertInstanceOf('Lightwerk\SurfCaptain\Tests\Unit\Mapper\DataMapperTest', $object);
    }

    /**
     * @return void
     * @test
     * @expectedException \Lightwerk\SurfCaptain\Mapper\Exception
     */
    public function mapOneToObjectThrowsExceptionIfObjectDataIsNoArray()
    {
        $dataMapperMock = $this->getAccessibleMock('Lightwerk\SurfCaptain\Mapper\DataMapper', ['getPropertyValue']);
        $dataMapperMock->_call('mapOneToObject', null, 'Lightwerk\SurfCaptain\Mapper\DataMapper', []);
    }
}
