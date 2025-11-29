**Editor Architecture**

Purpose: A technical reference for the Theme Editor internals — how theme inputs (templates, visual edits, code overrides) flow through the compiler and storage into live MUI ThemeOptions used by previews. Useful for maintainers, contributors and performance work.

**Quick index**
- Pipeline overview
- Data shapes and contracts
- Core files & hooks (exact references)
- Storage flow & save points
- Compiler / AST transform details
- Performance / caching
- Pain points and concrete fixes
- Recommended next steps

**Pipeline (concise)**
- Inputs: Base Themes (`src/Templates/*`), Visual Edits (property panels), Code Overrides (JS/TS editor).
- Transform steps:
  1. Base theme string → parsed DSL via `parseThemeCode()` (`src/Editor/Design/compiler/parsing/codeStringParser.ts`).
  2. Visual edits: stored as flat path → value in `currentSlice` (`src/Editor/Design/Edit/useEdit/currentSlice.ts`).
  3. Code overrides: parsed AST → safe DSL via `transformCodeToDsl()` (`src/Editor/Design/compiler/transformation/codeStringToDsl.ts`).
  4. Merge order and result: `createThemeOptionsFromEdits()` + `transformDslToThemeOptions()` produce the final `ThemeOptions` used by previews (`src/Editor/Design/Edit/useThemeCompilerCache.ts`).
  5. `useCreatedThemeOption` resolves the final `ThemeOptions` per color scheme for `createTheme()` and preview components (`src/Editor/Design/Edit/useCreatedThemeOption.ts`).

**Theme resolution (summary)**

- Formula (concise):

  baseTheme (partial) + visual edits + code overrides = themeOptions (partial)

  themeOptions (partial) -> `createTheme(themeOptions)` -> Theme (complete)

- Explanation:
  - `baseTheme` is a possibly partial ThemeOptions/DSL coming from templates or stored code.
  - `visual edits` are per-path overrides created via the UI (stored as flat path → value maps) and are applied on top of the base theme.
  - `code overrides` are user-entered JavaScript/DSL edits that are transformed into a safe DSL and then resolved into ThemeOptions; they may be partial and only override specific paths.
  - The merge result is a partial `themeOptions` object that contains only the settings that differ from the library defaults. `createTheme(themeOptions)` fills in defaults and derived values and returns a complete, runtime `Theme` object used by MUI components and previews.

- Practical notes / implications:
  - Validation and safety checks operate at the code→DSL→ThemeOptions boundary (the compiler). Keeping that logic centralized ensures the editor and storage only accept safe, well-formed inputs.
  - `codeOverridesFlattened` (a dot-path map derived from the resolved ThemeOptions) lets property panels quickly detect whether a particular path is overridden by code vs visual edits.
  - Storage persists the `themeOptions` (DSL/JSON) so it can be re-parsed deterministically; runtime `Theme` objects are not stored — they are produced on demand via `createTheme()` when needed.
  - Because `themeOptions` is partial, the order of merges matters (base → edits → code overrides) and is implemented in the compiler and `useThemeCompilerCache` so previews remain deterministic.

**Data shapes**
- Base Theme: `baseThemeCode` (string; serialized ThemeOptions/DSL) stored in `currentSlice`.
- Visual Edits: `colorSchemeIndependentVisualToolEdits: Record<string, SerializableValue>` and `colorSchemes: Record<string, { visualToolEdits: Record<string, SerializableValue> }>` in `currentSlice`.
- Code Overrides: `codeOverridesSource` (string) + `codeOverridesDsl` (safe DSL object) + `codeOverridesFlattened` (dot-path map) stored in `currentSlice`.
- Content identity: `contentHash` produced by `computeContentHash()` (uses `baseThemeCode`, visual edits and `codeOverridesFlattened`) in `currentSlice`.

**Core files & hooks (precise locations)**
- Editor UI and orchestrator: `src/Editor/Editor.tsx`, `src/Editor/useEditor.ts` (UI state store).
- Domain model (current theme state): `src/Editor/Design/Edit/useEdit/currentSlice.ts`.
- Undo/Redo history: `src/Editor/Design/Edit/useEdit/historySlice.ts` (patch-based history entries + save-point support).
- Per-path editing helper: `src/Editor/Design/Edit/useDesignerToolEdit.ts` (reads `codeOverridesFlattened`, visual edits and uses compiler cache for base lookups).
- Theme compiler cache: `src/Editor/Design/Edit/useThemeCompilerCache.ts` (memoized merge: parse base → apply edits + code overrides DSL → create final theme options).
- Created theme hook (per-scheme ThemeOptions): `src/Editor/Design/Edit/useCreatedThemeOption.ts`.
- Code transform (AST → DSL): `src/Editor/Design/compiler/transformation/codeStringToDsl.ts` (Acorn-based transform; supports spacing, breakpoints, helpers and arrow functions into placeholders).
- Parsing & serializing helpers: `src/Editor/Design/compiler/parsing/codeStringParser.ts` and `src/Editor/Design/compiler/index.ts`.
- Flattening utilities: `src/Editor/Design/compiler/utilities/flatten.ts`.
- Storage / saved designs: `src/Editor/Design/Storage/useStorageCollection.ts`, `sessionBuilder.ts`, `sessionRestorer.ts`, `useEditorStoreSync.ts`.

**Storage flow & save points**
- `useStorageCollection.saveCurrent()` composes a `themeOptionsCode` (stringified `useCreatedThemeOption()`), optionally includes `buildSessionData()` snapshot, and writes via a `StorageAdapter` (defaults to `deviceStorageAdapter`).
- After successful write the code calls `acknowledgeStoredModifications()` on the `currentSlice` (sets `lastStoredContentHash` to `contentHash`) and `recordStoragePoint(contentHash)` on `historySlice` to mark a history save-point. This provides saved-state detection via `currentHash === lastStoredContentHash`.

**Compiler / AST transform details**
- `transformCodeToDsl()` (`codeStringToDsl.ts`) parses user-supplied ThemeOptions-like JS code with Acorn, walks AST, and emits a safe DSL: placeholders for `theme.spacing()`, `theme.breakpoints.*`, `theme.palette.*`, MUI helper calls (`alpha`, `lighten`, `darken`), arrow function style styleOverrides. All unrecognized or unsafe constructs are rejected or produce warnings.
- The DSL is then transformed to executable `ThemeOptions` via `transformDslToThemeOptions()` (`src/Editor/Design/compiler/transformation/dslToThemeOptions.ts`).
- `useDeveloperEditTools.applyModifications()` uses `transformCodeToDsl()` and then calls `setCodeOverrides(source, result.dsl, {}, error)`; note the `flattened` parameter is currently `{}` in this call-site (see 'gap' below).

**Performance & caching**
- `useThemeCompilerCache` memoizes compiled theme by JSON.stringify of the inputs: `baseThemeCode`, `baseVisualToolEdits`, `colorSchemes`, `codeOverridesDsl`, `activeColorScheme`. The compiled theme is stored in a ref and returned from the hook to avoid repeated expensive transforms.
- `useDesignerToolEdit` uses the compiled theme for fast base lookups (avoids recomputing full theme for per-path reads).
- Suggestions to improve perf (if desired): compute hash-based keys (faster than JSON.stringify), workerize AST parsing/DSL transforms, debounce code editor transforms, and memoize placeholder resolution.

**Observed gaps & concrete fixes**
- Gap: `codeOverridesFlattened` is supported by the domain model and used by `useDesignerToolEdit` for direct path lookups, but `useDeveloperEditTools.applyModifications()` currently passes an empty `{}` as `flattened` into `setCodeOverrides()` (so it doesn't populate the flattened path map).
  - Why it matters: per-path code override checks (for property panels) rely on `codeOverridesFlattened[path]`; if empty, the UI falls back to visual edits or compiled theme, which can make inline code overrides harder to detect and to undo/redo at the path level.
  - Concrete fix: compute `flattened` via the compiler's flatten utility after transforming code→DSL→ThemeOptions and pass it into `setCodeOverrides`. Implementation steps:
    1. In `useDeveloperEditTools.applyModifications`, when `result.dsl` exists, call `transformDslToThemeOptions(result.dsl, context)` to get themeOptions (or reuse existing code path in compiler). Then call `flattenThemeObject(themeOptions)` (from `src/Editor/Design/compiler/utilities/flatten.ts`) to produce a dot-path map. Pass that as `flattened` to `setCodeOverrides(code, result.dsl, flattened, null)`.
    2. Ensure `historySlice.recordCodeChange()` is used consistently (current code records the previous source in `currentSlice.setCodeOverrides` which is fine).
    3. Add unit/logic tests for per-path lookup in `useDesignerToolEdit` covering code overrides detection.

**History vs Storage coordination (clarified)**
- The repo's approach separates history from storage: `historySlice` stores patches and supports save-point marking (`recordStoragePoint`). `currentSlice` stores `lastStoredContentHash`. `useStorageCollection.saveCurrent()` writes, then calls `acknowledgeStoredModifications()` and `recordStoragePoint(contentHash)`.
- If there's any race or inconsistency, it's likely caused by callers not invoking `recordStoragePoint` or `acknowledgeStoredModifications` consistently — adding a single function that wraps both (e.g., `markSaved(snapshotId?)`) in `useStorageCollection` could centralize the protocol and reduce bugs.

**Recommendations (prioritized)**
1. Populate `codeOverridesFlattened` at the point of applying code overrides (see concrete fix above). This is a small, low-risk PR that improves per-path UX and makes history operations consistent.
2. Replace JSON.stringify keys in `useThemeCompilerCache` with a stable content hash (xxhash or murmurhash) to improve cache key computation performance.
3. Workerize parsing and DSL transformations (Acorn + AST walk) to avoid jank during heavy edits.
4. Add a `StorageService.markSaved()` helper that performs `acknowledgeStoredModifications()` + `recordStoragePoint()` atomically to eliminate ordering bugs.
5. Add tests for: per-path code override detection; history undo/redo around save points; storage conflict scenarios.

**Recent updates (what I changed while working on this repo)**

- Centralized editor normalization/parsing helpers: `buildEditableCodeBodyContent`, `extractBody`, and `DEFAULT_BODY_CONTENT` moved (and exported) from the editor into
  `src/Editor/Design/compiler/parsing/codeStringParser.ts` so the compiler is the source of truth for accepted code shapes.
- Strict pre-validation: `src/Editor/Design/compiler/validation/validator.ts` now rejects any extraneous top-level tokens outside a single `const theme = { ... };` declaration. This enforces the editor's restricted input model (helps prevent accidental or malicious top-level code).
- Populated `codeOverridesFlattened`: the developer tools were updated so that after transforming code → DSL → ThemeOptions the resulting ThemeOptions are flattened (via `flattenThemeObject`) and passed into `currentSlice.setCodeOverrides(...)`. This fixes per-path override detection used by property panels.
- CodeEditor UX: reverted the earlier experimental header/footer externalization — the editor now stores and edits the full content (header + body + footer) inline in CodeMirror to match user preference. Paste/format/apply flows were adapted to format the full content and keep undo/selection behavior.
- Alert UI: `src/Editor/Properties/CodeEditor/AlertBar.tsx` was fixed to correctly show evaluation errors (it previously used `Error()` accidentally). Types for validation errors were aligned to the compiler `ValidationError` type.
- Layout stability: `src/Editor/Properties/CodeEditor/CodeEditor.tsx` and `src/Editor/Properties/CodeEditor/codemirror.css` updated so the editor container and CodeMirror scroller constrain height (preventing the editor from growing/shrinking the parent layout).

These changes are intended to centralize parsing/validation in the compiler module and to restore a predictable, non-janky editor UX while keeping validation strict and visible.

**Updated immediate next steps (high-priority)**
- Add unit tests for `extractBody()` and `validateCodeBeforeEvaluation()` to lock in the strict validation behavior and avoid regressions.
- Add unit tests for `useDeveloperEditTools.applyModifications()` to assert `codeOverridesFlattened` is populated and used by `useDesignerToolEdit` lookups.
- Run the dev server and QA the Code Editor flows (paste → format → apply; save/restore session; per-path override detection).

If you'd like, I can implement those tests next and then run the dev server to validate runtime behavior.

**Appendix: Quick references**
- `currentSlice` (domain state): `src/Editor/Design/Edit/useEdit/currentSlice.ts`
- `historySlice` (undo/redo): `src/Editor/Design/Edit/useEdit/historySlice.ts`
- `useDesignerToolEdit`: `src/Editor/Design/Edit/useDesignerToolEdit.ts`
- `useThemeCompilerCache`: `src/Editor/Design/Edit/useThemeCompilerCache.ts`
- Code transform: `src/Editor/Design/compiler/transformation/codeStringToDsl.ts`
- Parsing: `src/Editor/Design/compiler/parsing/codeStringParser.ts`
- Flatten util: `src/Editor/Design/compiler/utilities/flatten.ts`
- Storage collection: `src/Editor/Design/Storage/useStorageCollection.ts`

**Sequence Diagram**

```mermaid
sequenceDiagram
  participant User
  participant PropertyPanel as "Property Panel / UI"
  participant Designer as "useDesignerToolEdit"
  participant Current as "currentSlice (domain)"
  participant History as "historySlice"
  participant Compiler as "useThemeCompilerCache"
  participant Created as "useCreatedThemeOption"
  participant Preview as "Preview (ThemeProvider)"
  participant StorageCol as "useStorageCollection"
  participant Adapter as "StorageAdapter (device)"

  User->>PropertyPanel: change property (e.g. palette.primary.main)
  PropertyPanel->>Designer: setValue(path, value)
  Designer->>Current: addGlobalVisualEdit / addSchemeVisualEdit
  Current->>History: recordVisualChange(patches)
  Current-->>Current: computeContentHash() (contentHash updated)

  Note right of Compiler: reactive subscription
  Current-->>Compiler: inputs changed (base code, visual edits, code DSL)
  Compiler->>Compiler: parse base, merge visual edits, apply codeOverridesDsl
  Compiler-->>Created: compiledTheme
  Created-->>Preview: ThemeOptions -> createTheme() -> re-render previews

  User->>StorageCol: click Save
  StorageCol->>Created: read createdThemeOptions
  StorageCol->>Adapter: write(themeOptionsCode + session)
  Adapter-->>StorageCol: success
  StorageCol->>Current: acknowledgeStoredModifications() (set lastStoredContentHash)
  StorageCol->>History: recordStoragePoint(contentHash)
  StorageCol-->>User: saved confirmation

  Note over History, Current: Undo/Redo uses history patches + contentHash save-points
```

This diagram shows the normal happy-path: UI edits flow into the domain `currentSlice`, history receives patch entries, the compiler cache compiles a merged theme for previews, and storage persists a snapshot and marks a save point in history.

