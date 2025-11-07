# ThemeWorkspace Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────┐      ┌──────────────┐      ┌─────────────────┐           │
│  │ Color Picker  │      │ Base Theme   │      │  Composables    │           │
│  │  TextField    │      │   Selector   │      │    Toggles      │           │
│  └───────┬───────┘      └──────┬───────┘      └────────┬────────┘           │
│          │                     │                        │                    │
│          └─────────────────────┼────────────────────────┘                    │
│                                │                                             │
│                                ▼                                             │
│                    ┌──────────────────────┐                                  │
│                    │  useThemeValue Hook  │                                  │
│                    │                      │                                  │
│                    │  • value             │                                  │
│                    │  • isControlledBy    │                                  │
│                    │    Function          │                                  │
│                    │  • setValue()        │                                  │
│                    │  • resetToBase()     │                                  │
│                    └──────────┬───────────┘                                  │
│                               │                                              │
└───────────────────────────────┼──────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           STATE MANAGEMENT LAYER                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                  Zustand Store (with Zundo)                            │  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                        │  │
│  │  PERSISTENT (History-Tracked):                                        │  │
│  │  ┌──────────────────────────────────────────────────────────────┐     │  │
│  │  │ • activeBaseThemeOption: { type, ref }                      │     │  │
│  │  │ • appearanceComposablesState: { id: { enabled } }           │     │  │
│  │  │ • resolvedThemeOptionsModifications:                        │     │  │
│  │  │     { literals: {...}, functions: {...} }                   │     │  │
│  │  └──────────────────────────────────────────────────────────────┘     │  │
│  │                                                                        │  │
│  │  TRANSIENT (Not History-Tracked):                                     │  │
│  │  ┌──────────────────────────────────────────────────────────────┐     │  │
│  │  │ • rawThemeOptionsModifications: { path: value }             │     │  │
│  │  │ • isDirty: boolean                                          │     │  │
│  │  └──────────────────────────────────────────────────────────────┘     │  │
│  │                                                                        │  │
│  │  ACTIONS:                                                              │  │
│  │  • setRawModifications()         ← Live preview                       │  │
│  │  • commitRawModifications()       ← Create history snapshot           │  │
│  │  • discardChanges()               ← Reset to last commit              │  │
│  │  • setActiveBaseTheme()                                               │  │
│  │  • toggleComposable()                                                 │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────┬───────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        THEME RESOLUTION LAYER                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │              resolveThemeOptions(mode: 'raw' | 'failsafe')            │  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                        │  │
│  │  Layer 1: Base Theme                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐          │  │
│  │  │  getStaticBaseThemeOptions(ref)                        │          │  │
│  │  │  → Returns: default | dark | ios | material3           │          │  │
│  │  └─────────────────────────────────────────────────────────┘          │  │
│  │                          ↓                                             │  │
│  │  Layer 2: Composables (deepmerge)                                     │  │
│  │  ┌─────────────────────────────────────────────────────────┐          │  │
│  │  │  for each enabled composable:                           │          │  │
│  │  │    value = func(theme) or staticValue                   │          │  │
│  │  │    theme = deepmerge(theme, value)                      │          │  │
│  │  └─────────────────────────────────────────────────────────┘          │  │
│  │                          ↓                                             │  │
│  │  Layer 3: User Literals (deepmerge)                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐          │  │
│  │  │  literalLayer = expandFlatThemeOptions(literals)        │          │  │
│  │  │  theme = deepmerge(theme, literalLayer)                 │          │  │
│  │  └─────────────────────────────────────────────────────────┘          │  │
│  │                          ↓                                             │  │
│  │  Layer 4: User Functions (deepmerge)                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐          │  │
│  │  │  hydrated = hydrateFunctionsSafely(functions, mode)     │          │  │
│  │  │  functionLayer = expandFlatThemeOptions(hydrated)       │          │  │
│  │  │  theme = deepmerge(theme, functionLayer)                │          │  │
│  │  └─────────────────────────────────────────────────────────┘          │  │
│  │                          ↓                                             │  │
│  │                  Final ThemeOptions                                    │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────┬───────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            PREVIEW LAYER                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                      ThemePreviewPane                                  │  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                        │  │
│  │  const themeOptions = resolveThemeOptionsForPreview()                 │  │
│  │  const theme = createTheme(themeOptions)                              │  │
│  │                                                                        │  │
│  │  <ThemeProvider theme={theme}>                                        │  │
│  │    {children}                                                          │  │
│  │  </ThemeProvider>                                                      │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════

                          RESOLUTION MODE COMPARISON

┌────────────────────────────┬────────────────────────────────────────────────┐
│   'failsafe' (Preview)     │              'raw' (Export)                    │
├────────────────────────────┼────────────────────────────────────────────────┤
│ • Safe evaluation          │ • Strict evaluation                            │
│ • Catches errors           │ • Throws on errors                             │
│ • Returns fallbacks        │ • Ensures valid code                           │
│ • Used in live preview     │ • Used for export/commit                       │
│ • Example fallback:        │ • Example behavior:                            │
│   Color error → '#cccccc'  │   Invalid syntax → throws Error                │
└────────────────────────────┴────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

                              DATA FLOW EXAMPLE

1. User types in color picker:
   └─► setValue('#ff0000')

2. Store updates transient buffer:
   └─► rawThemeOptionsModifications['palette.primary.main'] = '#ff0000'
   └─► isDirty = true

3. Preview subscribes to raw changes:
   └─► ThemePreviewPane re-renders

4. Resolver applies layers (failsafe mode):
   └─► Base → Composables → Literals → Functions
   └─► Returns complete ThemeOptions

5. MUI creates theme:
   └─► createTheme(themeOptions)

6. User clicks "Save":
   └─► commitRawModifications()
   └─► raw → splitThemeOptions() → resolved
   └─► History snapshot created
   └─► isDirty = false

═══════════════════════════════════════════════════════════════════════════════
```
