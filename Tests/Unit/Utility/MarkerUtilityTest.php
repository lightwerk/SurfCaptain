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
	 * @dataProvider replaceVariablesInValueNotMatchingDataProvider
	 */
	public function replaceVariablesInValueReturnsUnchangedStringIfNoMarkerMatches($value, $variables, $expectation) {
		$this->assertSame($expectation, MarkerUtility::replaceVariablesInValue($value, $variables));
	}

	/**
	 * Data provider for replaceVariablesInValueReturnsUnchangedStringIfNoMarkerMatches
	 *
	 * @return array
	 */
	public function replaceVariablesInValueNotMatchingDataProvider() {
		return array(
			'no match Set 1' => array('Replacer', array('ReplaceMe' => 'bar', 'ReplaceMe2' => 'foo'), 'Replacer'),
			'no match Set 2' => array('myString', array(1 => array( 1 => 2), 3 => 4), 'myString')
		);
	}

	/**
	 * @param string $value
	 * @param array $variables
	 * @param string $expectation
	 * @return void
	 * @test
	 * @dataProvider replaceVariablesInValueMatchingDataProvider
	 */
	public function replaceVariablesInValueReturnsStringWithSubstitutedValues($value, $variables, $expectation) {
		$this->assertSame($expectation, MarkerUtility::replaceVariablesInValue($value, $variables));
	}

	/**
	 * Data provider for replaceVariablesInValueReturnsStringWithSubstitutedValues
	 *
	 * @return array
	 */
	public function replaceVariablesInValueMatchingDataProvider() {
		return array(
			'no match Set 1' => array('{{marker}}', array('marker' => 'bar', 'ReplaceMe2' => 'foo'), 'bar'),
			'no match Set 2' => array('{{marker}}', array(1 => array( 1 => 2), 'marker' => 'foo'), 'foo')
		);
	}
}