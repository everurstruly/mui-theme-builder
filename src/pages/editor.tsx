import Editor from "../editor/Editor";
import { ScopedCssBaseline } from "@mui/material";

export default function EditorPage() {
  return (
    <>
      <ScopedCssBaseline enableColorScheme />
      <Editor />
    </>
  );
}
