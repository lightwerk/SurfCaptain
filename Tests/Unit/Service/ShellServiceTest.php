<?php
namespace Lightwerk\SurfCaptain\Tests\Unit\Service;

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
class ShellServiceTest extends UnitTestCase
{
    /**
     * @var \Lightwerk\SurfCaptain\Service\ShellService
     */
    protected $shellServiceMock;

    /**
     * @return void
     */
    public function setUp()
    {
        $this->shellServiceMock = $this->getMock('Lightwerk\SurfCaptain\Service\ShellService', ['executeCommand']);
    }

    /**
     * @return void
     */
    public function tearDown()
    {
        $this->shellServiceMock = null;
    }

    /**
     * @test
     * @return void
     */
    public function checkLoginCallsExecuteCommand()
    {
        $this->shellServiceMock
            ->expects($this->once())
            ->method('executeCommand')
            ->will($this->returnValue([0, 'output']));

        $this->shellServiceMock->checkLogin('host', 'user');
    }

    /**
     * @param string $hostname
     * @param string $username
     * @param integer $port
     * @param string $expectation
     * @return void
     * @test
     * @dataProvider checkLoginDataProvider
     */
    public function checkLoginBuildsCommandWithPassedParameter($hostname, $username, $port, $expectation)
    {
        $this->shellServiceMock
            ->expects($this->once())
            ->method('executeCommand')
            ->with($expectation)
            ->will($this->returnValue([0, 'output']));

        $return = $this->shellServiceMock->checkLogin($hostname, $username, $port);
        $this->assertTrue($return);
    }

    /**
     * Data provider for checkLoginBuildsCommandWithPassedParameter
     *
     * @return array
     */
    public function checkLoginDataProvider()
    {
        return [
            'hostname, username and port given' => [
                'host',
                'user',
                8080,
                "ssh -t -t -o LogLevel=ERROR -p '8080' user@host 2>&1"
            ],
            'hostname and username given' => ['host', 'user', 0, 'ssh -t -t -o LogLevel=ERROR user@host 2>&1'],
            'only hostname given' => ['host', '', 0, 'ssh -t -t -o LogLevel=ERROR host 2>&1']
        ];
    }

    /**
     * @test
     * @return void
     * @expectedException \Lightwerk\SurfCaptain\Service\Exception
     */
    public function checkLoginThrowsExceptionIfExecuteCommandReturnsExitCode()
    {
        $this->shellServiceMock
            ->expects($this->once())
            ->method('executeCommand')
            ->will($this->returnValue([1, 'output']));

        $this->shellServiceMock->checkLogin('host', 'user');
    }
}
