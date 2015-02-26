<?php
namespace Lightwerk\SurfCaptain\Tests\Unit\Utility;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Tests\UnitTestCase;
use Lightwerk\SurfCaptain\Utility\MarkerUtility;

/**
 * DriverCompositeTest
 *
 * @package Lightwerk\SurfCaptain
 * @author Daniel Goerz <dlg@lightwerk.com>
 */
class MarkerUtilityTest extends UnitTestCase {

	/**
	 * @param string $value
	 * @param array $variables
	 * @param string $expectation
	 * @return void
	 * @test
	 * @dataProvider replaceVariablesInValueDataProvider
	 */
	public function replaceVariablesInValueReturnsStringWithSubstitutedValues($value, $variables, $expectation) {
		$this->assertSame($expectation, MarkerUtility::replaceVariablesInValue($value, $variables));
	}

	/**
	 * Data provider for replaceVariablesInValueReturnsStringWithSubstitutedValues
	 *
	 * @return array
	 */
	public function replaceVariablesInValueDataProvider() {
		return array(
			'set1' => array('Replacer', array('ReplaceMe' => 'bar', 'ReplaceMe2' => 'foo'), 'Replacer'),
			'set2' => array('myString', array(1 => array( 1 => 2), 3 => 4), 'myString')
		);
	}
}