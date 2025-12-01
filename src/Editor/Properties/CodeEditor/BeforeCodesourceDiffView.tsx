import CodeMirror from "@uiw/react-codemirror";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { useMemo, useState, useRef, useEffect } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, ViewPlugin } from "@codemirror/view";
import useCreatedTheme from "../../Design/Current/useCreatedTheme";

export default function BeforeCodesourceDiffView() {
  const mergedPreview = useCreatedTheme();

  // Render mergedPreview as JavaScript-like object literal (no quoted keys)
  const themeJson = useMemo(() => {
    const indent = (n: number) => "  ".repeat(n);
    const seen = new WeakSet();

    function isPlainObject(v: unknown) {
      return Object.prototype.toString.call(v) === "[object Object]";
    }

    function safeStringify(value: unknown, depth = 0): string {
      if (value === null) return "null";
      if (value === undefined) return "undefined";
      const t = typeof value;
      if (t === "string") return `'${String(value).replace(/'/g, "\\'")}'`;
      if (t === "number" || t === "boolean") return String(value);
      if (t === "function") return "/* function omitted */";
      if (Array.isArray(value)) {
        if (seen.has(value)) return "/* Circular */ []";
        seen.add(value);
        if (value.length === 0) return "[]";
        const items = value.map((it) => safeStringify(it, depth + 1));
        seen.delete(value);
        return `[\n${indent(depth + 1)}${items.join(
          `,\n${indent(depth + 1)}`
        )}\n${indent(depth)}]`;
      }
      if (isPlainObject(value)) {
        if (seen.has(value)) return "/* Circular */ {}";
        seen.add(value);
        const keys = Object.keys(value);
        if (keys.length === 0) {
          seen.delete(value);
          return "{}";
        }
        const obj = value as Record<string, unknown>;
        const lines = keys.map((k) => {
          const v = obj[k];
          // if value is function, omit its body and show placeholder
          const rendered = safeStringify(v, depth + 1);
          // use unquoted key when it's a valid identifier
          const validId = /^[$A-Z_][0-9A-Z_$]*$/i.test(k);
          const keyText = validId ? k : `'${k.replace(/'/g, "\\'")}'`;
          return `${indent(depth + 1)}${keyText}: ${rendered}`;
        });
        seen.delete(value);
        return `{\n${lines.join(",\n")}\n${indent(depth)}}`;
      }
      // Fallback for other types (Symbol, etc.)
      try {
        return JSON.stringify(value);
      } catch {
        return "undefined";
      }
    }

    try {
      return safeStringify(mergedPreview || {}, 0);
    } catch {
      return String(mergedPreview);
    }
  }, [mergedPreview]);

  // Search state
  const [query, setQuery] = useState<string>("");
  const [matches, setMatches] = useState<number[]>([]);
  const [currentMatchIdx, setCurrentMatchIdx] = useState<number>(-1);
  const editorViewRef = useRef<EditorView | null>(null);

  // Attach a small view plugin so we can access the EditorView instance
  const attachViewPlugin = useMemo(() =>
    ViewPlugin.fromClass(
      class {
        view: EditorView;
        constructor(view: EditorView) {
          this.view = view;
          editorViewRef.current = view;
        }
        destroy() {
          if (editorViewRef.current === this.view) editorViewRef.current = null;
        }
      }
    ),
    []
  );

  // Compute match positions (case-insensitive substring search)
  useEffect(() => {
    if (!query) {
      setMatches([]);
      setCurrentMatchIdx(-1);
      return;
    }

    try {
      const text = themeJson || "";
      const pattern = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape
      const re = new RegExp(pattern, "gi");
      const idxs: number[] = [];
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        idxs.push(m.index);
        // Avoid infinite loops for zero-length matches
        if (re.lastIndex === m.index) re.lastIndex++;
      }
      setMatches(idxs);
      setCurrentMatchIdx(idxs.length > 0 ? 0 : -1);
    } catch {
      setMatches([]);
      setCurrentMatchIdx(-1);
    }
  }, [query, themeJson]);

  // Move selection to current match when it changes
  useEffect(() => {
    const idx = currentMatchIdx;
    if (idx < 0 || !matches.length) return;
    const from = matches[idx];
    const to = from + query.length;
    const view = editorViewRef.current;
    if (!view) return;
    try {
      view.dispatch({ selection: { anchor: from, head: to }, scrollIntoView: true });
    } catch {
      // ignore
    }
  }, [currentMatchIdx, matches, query]);

  const goNext = () => {
    if (!matches.length) return;
    setCurrentMatchIdx((i) => (i + 1) % matches.length);
  };

  const goPrev = () => {
    if (!matches.length) return;
    setCurrentMatchIdx((i) => (i - 1 + matches.length) % matches.length);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 1,
        pt: 2,
      }}
    >
      <Box sx={{ px: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Theme Object (Without Code Overrides)
        </Typography>
        <Typography component="p" color="text.secondary" fontSize="caption.fontSize">
          This is what the current theme looks like with template and visual edits
          merged (excluding code overrides)
        </Typography>
      </Box>

      {/* Search bar for quick substring lookup */}
      <Box sx={{ px: 1.5, display: 'flex', alignItems: 'center', columnGap: 1 }}>
        <TextField
          size="small"
          placeholder="Search preview..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            // Navigate matches with ArrowUp/ArrowDown; Enter moves next (Shift+Enter previous)
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              goNext();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              goPrev();
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (e.shiftKey) goPrev(); else goNext();
            }
          }}
          inputProps={{ 'aria-label': 'Search theme preview' }}
          sx={{ flex: 1 }}
        />
        <IconButton size="small" onClick={goPrev} aria-label="previous match">
          ‹
        </IconButton>
        <IconButton size="small" onClick={goNext} aria-label="next match">
          ›
        </IconButton>
        <Typography variant="caption" color="text.secondary">
          {matches.length > 0 ? `${currentMatchIdx + 1}/${matches.length}` : '0/0'}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          "& .cm-editor": { height: "100%", fontSize: "12px" },
        }}
      >
        <CodeMirror
          value={themeJson}
          theme="dark"
          style={{ height: "100%" }}
          editable={false}
          extensions={[javascript({ typescript: false, jsx: false }), attachViewPlugin]}
          basicSetup={{
            lineNumbers: false,
            highlightActiveLineGutter: false,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: false,
            indentOnInput: false,
            bracketMatching: true,
            closeBrackets: false,
            autocompletion: false,
            rectangularSelection: true,
            highlightSelectionMatches: false,
            searchKeymap: true,
          }}
        />
      </Box>
    </Box>
  );
}
