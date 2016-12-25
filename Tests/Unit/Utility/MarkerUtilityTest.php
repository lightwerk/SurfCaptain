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
class MarkerUtilityTest extends UnitTestCase
{
    /**
     * @param string $value
     * @param array $variables
     * @param string $expectation
     * @return void
     * @test
     * @dataProvider replaceVariablesInValueNotMatchingDataProvider
     */
    public function replaceVariablesInValueReturnsUnchangedStringIfNoMarkerMatches($value, $variables, $expectation)
    {
        $this->assertSame($expectation, MarkerUtility::replaceVariablesInValue($value, $variables));
    }

    /**
     * Data provider for replaceVariablesInValueReturnsUnchangedStringIfNoMarkerMatches
     *
     * @return array
     */
    public function replaceVariablesInValueNotMatchingDataProvider()
    {
        return [
            'no match Set 1' => ['Replacer', ['ReplaceMe' => 'bar', 'ReplaceMe2' => 'foo'], 'Replacer'],
            'no match Set 2' => ['myString', [1 => [1 => 2], 3 => 4], 'myString']
        ];
    }

    /**
     * @param string $value
     * @param array $variables
     * @param string $expectation
     * @return void
     * @test
     * @dataProvider replaceVariablesInValueMatchingDataProvider
     */
    public function replaceVariablesInValueReturnsStringWithSubstitutedValues($value, $variables, $expectation)
    {
        $this->assertSame($expectation, MarkerUtility::replaceVariablesInValue($value, $variables));
    }

    /**
     * Data provider for replaceVariablesInValueReturnsStringWithSubstitutedValues
     *
     * @return array
     */
    public function replaceVariablesInValueMatchingDataProvider()
    {
        return [
            'Matching Set 1' => ['{{marker}}', ['marker' => 'bar', 'ReplaceMe2' => 'foo'], 'bar'],
            'Matching Set 2' => ['{{marker}}', [1 => [1 => 2], 'marker' => 'foo'], 'foo']
        ];
    }
}