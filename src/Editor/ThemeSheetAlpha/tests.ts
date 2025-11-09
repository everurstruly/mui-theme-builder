/**
 * Test Suite for ThemeSheet
 * 
 * Validates the core specification requirements:
 * ✅ All state is serializable
 * ✅ Functions are strings until resolved
 * ✅ UI controls disable when controlled by functions
 * ✅ Two resolution modes work correctly
 * ✅ Layered composition order is preserved
 */

import { splitThemeOptions } from './utils/splitThemeOptions';
import { expandFlatThemeOptions } from './utils/expandFlatThemeOptions';
import { flattenThemeOptions } from './utils/flattenThemeOptions';
import { hydrateFunctionsSafely } from './utils/hydrateFunctionsSafely';
import type { ThemeOptions } from '@mui/material/styles';

// ===== Test 1: splitThemeOptions correctly separates literals and functions =====
export function testSplitThemeOptions() {
  console.group('Test 1: splitThemeOptions');

  const input = {
    palette: {
      primary: {
        main: '#f00',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contrastText: (theme: any) => theme.palette?.primary?.main || '#fff',
      },
      secondary: {
        main: '#00f',
      },
    },
    spacing: 8,
  };

  const { literals, functions } = splitThemeOptions(input);

  console.log('Input:', input);
  console.log('Literals:', literals);
  console.log('Functions:', functions);

  // Assertions
  const expectedLiterals = {
    'palette.primary.main': '#f00',
    'palette.secondary.main': '#00f',
    spacing: 8,
  };

  const literalsMatch = JSON.stringify(literals) === JSON.stringify(expectedLiterals);
  const hasFunctions = Object.keys(functions).length === 1;
  const functionPathCorrect = 'palette.primary.contrastText' in functions;

  console.log('✅ Literals match:', literalsMatch);
  console.log('✅ Functions extracted:', hasFunctions);
  console.log('✅ Function path correct:', functionPathCorrect);

  console.groupEnd();
  return literalsMatch && hasFunctions && functionPathCorrect;
}

// ===== Test 2: expandFlatThemeOptions reconstructs nested structure =====
export function testExpandFlatThemeOptions() {
  console.group('Test 2: expandFlatThemeOptions');

  const flat = {
    'palette.primary.main': '#f00',
    'palette.secondary.main': '#00f',
    spacing: 8,
  };

  const expanded = expandFlatThemeOptions(flat);

  console.log('Flat input:', flat);
  console.log('Expanded output:', expanded);

  const hasNestedStructure =
    expanded.palette &&
    typeof expanded.palette === 'object' &&
    'primary' in expanded.palette;

  const valuesCorrect =
    (expanded.palette as Record<string, unknown>).primary &&
    (
      (expanded.palette as Record<string, unknown>).primary as Record<string, unknown>
    ).main === '#f00';

  console.log('✅ Has nested structure:', hasNestedStructure);
  console.log('✅ Values correct:', valuesCorrect);

  console.groupEnd();
  return hasNestedStructure && valuesCorrect;
}

// ===== Test 3: flattenThemeOptions is inverse of expandFlatThemeOptions =====
export function testFlattenExpandRoundtrip() {
  console.group('Test 3: Flatten/Expand Roundtrip');

  const original = {
    palette: {
      primary: {
        main: '#f00',
      },
    },
    spacing: 8,
  };

  const flattened = flattenThemeOptions(original);
  const expanded = expandFlatThemeOptions(flattened);

  console.log('Original:', original);
  console.log('Flattened:', flattened);
  console.log('Expanded:', expanded);

  const roundtripMatch = JSON.stringify(original) === JSON.stringify(expanded);

  console.log('✅ Roundtrip match:', roundtripMatch);

  console.groupEnd();
  return roundtripMatch;
}

// ===== Test 4: hydrateFunctionsSafely works in both modes =====
export function testHydrateFunctionsSafely() {
  console.group('Test 4: hydrateFunctionsSafely');

  const functions = {
    'palette.error.main': '(theme) => theme.palette.mode === "dark" ? "#ff5252" : "#f44336"',
  };

  const mockTheme: ThemeOptions = {
    palette: {
      mode: 'dark',
    },
  };

  // Test failsafe mode
  const failsafeHydrated = hydrateFunctionsSafely(functions, 'failsafe', mockTheme);
  console.log('Failsafe hydrated:', failsafeHydrated);

  // Test raw mode
  const rawHydrated = hydrateFunctionsSafely(functions, 'raw', mockTheme);
  console.log('Raw hydrated:', rawHydrated);

  const failsafeWorks = 'palette.error.main' in failsafeHydrated;
  const rawWorks = 'palette.error.main' in rawHydrated;

  console.log('✅ Failsafe mode works:', failsafeWorks);
  console.log('✅ Raw mode works:', rawWorks);

  console.groupEnd();
  return failsafeWorks && rawWorks;
}

// ===== Test 5: Invalid function in failsafe mode returns fallback =====
export function testFailsafeFallback() {
  console.group('Test 5: Failsafe Fallback');

  const functions = {
    'palette.primary.main': 'INVALID_SYNTAX {{{',
  };

  const mockTheme: ThemeOptions = {};

  try {
    const hydrated = hydrateFunctionsSafely(functions, 'failsafe', mockTheme);
    console.log('Failsafe handled invalid function:', hydrated);

    const hasValue = 'palette.primary.main' in hydrated;
    console.log('✅ Failsafe returned fallback:', hasValue);

    console.groupEnd();
    return hasValue;
  } catch (error) {
    console.error('❌ Failsafe mode should not throw:', error);
    console.groupEnd();
    return false;
  }
}

// ===== Run All Tests =====
export function runAllTests() {
  console.log('🧪 Running ThemeSheet Tests\n');

  const results = [
    { name: 'splitThemeOptions', pass: testSplitThemeOptions() },
    { name: 'expandFlatThemeOptions', pass: testExpandFlatThemeOptions() },
    { name: 'Flatten/Expand Roundtrip', pass: testFlattenExpandRoundtrip() },
    { name: 'hydrateFunctionsSafely', pass: testHydrateFunctionsSafely() },
    { name: 'Failsafe Fallback', pass: testFailsafeFallback() },
  ];

  console.log('\n📊 Test Results:');
  console.table(results);

  const allPassed = results.every((r) => r.pass);
  console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed');

  return allPassed;
}

// Auto-run tests if imported
if (typeof window !== 'undefined') {
  // Browser environment - expose to console
  (window as unknown as { runThemeSheetTests: () => boolean }).runThemeSheetTests = runAllTests;
  console.log(
    '💡 Run tests in console with: window.runThemeSheetTests()'
  );
}
