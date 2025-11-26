# Theme Compiler

Safe transformation and validation service for MUI theme code. Acts as the security boundary between user-written code and runtime ThemeOptions, using a Domain-Specific Language (DSL) to prevent code injection.

## Architecture

```
themeCompiler/
├── types.ts                      # DSL type definitions
├── index.ts                      # Barrel exports + convenience service
├── validation/
│   └── validator.ts              # Syntax & structure validation
├── transformation/
│   ├── codeToDsl.ts              # JavaScript → DSL
│   ├── dslToTheme.ts             # DSL → ThemeOptions
│   └── editsToTheme.ts           # Visual edits → ThemeOptions
├── parsing/
│   └── codeParser.ts             # AST parsing utilities
└── utilities/
    └── flatten.ts                # Helper functions
```

## Separation of Concerns

### 1. Validation (`validation/`)
**Responsibility:** Ensure code safety before transformation
- **validator.ts**: AST-based syntax validation, dangerous pattern detection
- **Exports:** `validateCodeBeforeEvaluation()`, `useCodeOverridesValidation()`
- **Use case:** Pre-flight checks before parsing user code

### 2. Transformation (`transformation/`)
**Responsibility:** Convert between code representations
- **codeToDsl.ts**: Transform JavaScript ThemeOptions → safe DSL
- **dslToTheme.ts**: Transform DSL → executable ThemeOptions
- **editsToTheme.ts**: Merge visual tool edits + code overrides → ThemeOptions
- **Use case:** Safe code execution pipeline

### 3. Parsing (`parsing/`)
**Responsibility:** AST manipulation and code serialization
- **codeParser.ts**: Parse JSON/JavaScript, serialize ThemeOptions
- **Use case:** Convert stored code strings to runtime objects

### 4. Utilities (`utilities/`)
**Responsibility:** Helper functions for theme manipulation
- **flatten.ts**: Flatten nested objects for efficient lookups
- **Use case:** Theme comparison, path-based access

## Usage

### Import Patterns

```typescript
// Convenience service (recommended for most use cases)
import { themeCompiler } from '@/Editor/Design/themeCompiler';

// Direct imports for specific use cases
import { validateCodeBeforeEvaluation } from '@/Editor/Design/themeCompiler/validation/validator';
import { transformCodeToDsl } from '@/Editor/Design/themeCompiler/transformation/codeToDsl';
import { parseThemeCode } from '@/Editor/Design/themeCompiler/parsing/codeParser';
```

### Validation Example

```typescript
const result = themeCompiler.validateThemeCode(userCode);
if (!result.valid) {
  console.error(result.errors);
}
```

### Transformation Pipeline

```typescript
// 1. Validate
const validation = validateCodeBeforeEvaluation(userCode);
if (!validation.valid) throw new Error('Invalid code');

// 2. Transform to DSL
const dslResult = transformCodeToDsl(userCode);
if (dslResult.error) throw new Error(dslResult.error);

// 3. Transform to ThemeOptions
const themeOptions = transformDslToThemeOptions(dslResult.dsl, context);
```

### Visual Edits Resolution

```typescript
import createThemeOptionsFromEdits from '@/Editor/Design/themeCompiler/transformation/editsToTheme';

const resolved = createThemeOptionsFromEdits({
  template: materialTemplate,
  baseVisualToolEdits: { 'typography.fontSize': 16 },
  colorSchemeVisualToolEdits: { 'palette.primary.main': '#1976d2' },
  codeOverrides: parsedCodeOverrides,
});
```

## Security Model

### DSL Placeholders
User code is **never** executed directly. Instead, it's transformed to a DSL with placeholders:

```javascript
// User writes:
theme.spacing(2)

// Transformed to DSL:
{ __type: 'spacing', args: [2] }

// Resolved by OUR implementation:
(theme) => theme.spacing(2)  // Controlled, safe MUI function
```

### Allowed Patterns
- `theme.spacing(n)`
- `theme.palette.*.main` (token references)
- `theme.breakpoints.up('md')`
- `alpha('#fff', 0.5)`, `lighten()`, `darken()`
- Arrow functions: `({ theme }) => ({ ... })`

### Blocked Patterns
- `eval()`, `Function()` constructors
- Prototype pollution: `__proto__`, `constructor`, `prototype`
- Arbitrary property access
- Dynamic code execution

## Type System

### Core Types
- `ThemeDsl`: Complete DSL representation of ThemeOptions
- `DslPlaceholder`: Union of all placeholder types
- `DslValue`: Recursive value type (primitives | placeholders | arrays | objects)
- `DslTransformResult`: Result of code → DSL transformation
- `DslResolutionContext`: Context for resolving DSL → ThemeOptions

### Validation Types
- `ValidationResult`: Validation outcome with errors/warnings
- `ValidationError`: Error with line/column location for CodeMirror
- `CodeEvaluationResult`: Final evaluation result with flattened theme

## Migration from Old Structure

**Before:**
```typescript
import { transformCodeToDsl } from '@/Editor/Design/domainSpecificLanguage/themeOptionsToDslTransformer';
import { validateCodeBeforeEvaluation } from '@/Editor/Design/domainSpecificLanguage/dslValidator';
```

**After:**
```typescript
import { transformCodeToDsl } from '@/Editor/Design/themeCompiler/transformation/codeToDsl';
import { validateCodeBeforeEvaluation } from '@/Editor/Design/themeCompiler/validation/validator';

// Or use barrel export:
import { transformCodeToDsl, validateCodeBeforeEvaluation } from '@/Editor/Design/themeCompiler';
```

## Testing

Run validation on theme code:
```bash
pnpm run test:theme-compiler
```

Check for security vulnerabilities:
```bash
pnpm run test:security
```

## Future Enhancements

- [ ] Support for custom MUI components in DSL
- [ ] Advanced breakpoint queries (not, print, etc.)
- [ ] Type-safe DSL builder API
- [ ] Performance profiling for large themes
- [ ] Incremental transformation (only changed paths)
