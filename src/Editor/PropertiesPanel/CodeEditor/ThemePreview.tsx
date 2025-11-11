import CodeMirror from "@uiw/react-codemirror";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useCodeEditorPanel } from "../../ThemeDesign";
import { javascript } from "@codemirror/lang-javascript";

export default function ThemePreview() {
  const { mergedPreview } = useCodeEditorPanel();

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

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          "& .cm-editor": { height: "100%", fontSize: "13px" },
        }}
      >
        <CodeMirror
          value={themeJson}
          theme="dark"
          style={{ height: "100%" }}
          editable={false}
          extensions={[javascript({ typescript: false, jsx: false })]}
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
