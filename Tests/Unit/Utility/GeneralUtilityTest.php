<?php
namespace Lightwerk\SurfCaptain\Tests\Unit\Utility;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Tests\UnitTestCase;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;

/**
 * DriverCompositeTest
 *
 * @package Lightwerk\SurfCaptain
 * @author Daniel Goerz <dlg@lightwerk.com>
 */
class GeneralUtilityTest extends UnitTestCase {

	/**
	 * @test
	 * @return void
	 * @expectedException \Lightwerk\SurfCaptain\Utility\Exception
	 */
	public function getUrlPartsFromRepositoryUrlThrowsExceptionIfNoValidRepositoryUrlIsGiven() {
		GeneralUtility::getUrlPartsFromRepositoryUrl('foo');
	}

	/**
	 * @return void
	 * @test
	 * @dataProvider getRepositoryUrlDataProvider
	 */
	public function getUrlPartsFromRepositoryUrlReturnsArrayForValidRepositoryUrl($repositoryUrl, $expectation) {
		$this->assertSame(GeneralUtility::getUrlPartsFromRepositoryUrl($repositoryUrl), $expectation);
	}

	/**
	 * Data provider for getUrlPartsFromRepositoryUrlReturnsArrayForValidRepositoryUrl
	 *
	 * @return array
	 */
	public function getRepositoryUrlDataProvider() {
		return array(
			'set1' => array(
				'foo@git.host.tld:path/to/repository.git', array(
					0 => 'foo@git.host.tld:path/to/repository.git',
					1 => 'foo@',
					'user' => 'foo',
					2 => 'foo',
					'host' => 'git.host.tld',
					3 => 'git.host.tld',
					'path' => 'path/to/repository',
					4 => 'path/to/repository'
				)
			),
			'set2' => array(
				'git.host.tld:path/to/repository.git', array(
					0 => 'git.host.tld:path/to/repository.git',
					1 => '',
					'user' => '',
					2 => '',
					'host' => 'git.host.tld',
					3 => 'git.host.tld',
					'path' => 'path/to/repository',
					4 => 'path/to/repository'
				)
			),
			'set3' => array(
				'git.host.tld:a.git', array(
					0 => 'git.host.tld:a.git',
					1 => '',
					'user' => '',
					2 => '',
					'host' => 'git.host.tld',
					3 => 'git.host.tld',
					'path' => 'a',
					4 => 'a'
				)
			),
			'set4' => array(
				'host:a.git', array(
					0 => 'host:a.git',
					1 => '',
					'user' => '',
					2 => '',
					'host' => 'host',
					3 => 'host',
					'path' => 'a',
					4 => 'a'
				)
			),
		);
	}

	/**
	 * @param string $string
	 * @param string $expectation
	 * @return void
	 * @test
	 * @dataProvider camelCaseToLowerCaseUnderscoredDataProvider
	 */
	public function camelCaseToLowerCaseUnderscoredReturnsConvertedString($string, $expectation) {
		$this->assertSame(GeneralUtility::camelCaseToLowerCaseUnderscored($string), $expectation);
	}

	/**
	 * Data provider for camelCaseToLowerCaseUnderscoredReturnsConvertedString
	 *
	 * @return array
	 */
	public function camelCaseToLowerCaseUnderscoredDataProvider() {
		return array(
			'set1' => array('fooBar', 'foo_bar'),
			'set2' => array('fooBarFooBar', 'foo_bar_foo_bar'),
			'set3' => array('FooBar', 'foo_bar'),
			'set4' => array('FOOBaR', 'f_o_o_ba_r')
		);
	}

}