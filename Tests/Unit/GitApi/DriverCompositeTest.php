<?php
namespace Lightwerk\SurfCaptain\Tests\Unit\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Tests\UnitTestCase;

/**
 * DriverCompositeTest
 *
 * @package Lightwerk\SurfCaptain
 */
class DriverCompositeTest extends UnitTestCase
{
    /**
     * @var \Lightwerk\SurfCaptain\GitApi\DriverComposite
     */
    protected $driverCompositeMock;

    /**
     * @return void
     */
    public function setUp()
    {
        $this->driverCompositeMock = $this->getAccessibleMock('Lightwerk\SurfCaptain\GitApi\DriverComposite',
            ['assureClassExists']);
    }

    /**
     * @return void
     */
    public function tearDown()
    {
        $this->driverCompositeMock = null;
    }

    /**
     * @test
     * @return void
     */
    public function resolveClassNameReturnsClassNameFromClassName()
    {
        $source = [
            'className' => 'Foo\Bar\Class'
        ];
        $className = $this->driverCompositeMock->_call('resolveClassName', $source, 'foo');
        $this->assertEquals($className, 'Foo\Bar\Class');
    }

    /**
     * @test
     * @return void
     */
    public function resolveClassNameReturnsClassNameFromDriver()
    {
        $source = [
            'driver' => 'Foo'
        ];
        $className = $this->driverCompositeMock->_call('resolveClassName', $source, 'foo');
        $this->assertEquals($className, '\Lightwerk\SurfCaptain\GitApi\Driver\FooDriver');
    }

    /**
     * @test
     * @return void
     */
    public function resolveClassNameReturnsClassNameFromLowerCaseDriver()
    {
        $source = [
            'driver' => 'foo'
        ];
        $className = $this->driverCompositeMock->_call('resolveClassName', $source, 'foo');
        $this->assertEquals($className, '\Lightwerk\SurfCaptain\GitApi\Driver\FooDriver');
    }

    /**
     * @test
     * @return void
     * @expectedException \Lightwerk\SurfCaptain\GitApi\Exception
     */
    public function resolveClassNameThrowsExceptionIfNeitherClassNameNorDriverIsGiven()
    {
        $source = [
            'foo' => 'bar'
        ];
        $this->driverCompositeMock->_call('resolveClassName', $source, 'foo');
    }
}
