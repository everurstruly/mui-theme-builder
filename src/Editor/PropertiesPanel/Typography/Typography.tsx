import FontFamily from "./FontFamily/FontFamily";
import FontStyle from "./FontStyle/FontStyle";
import FontWeight from "./FontWeight/FontWeight";

export default function TypographyProperty() {
  return (
    <>
      <FontFamily title="Font Family" />
      <FontStyle title="Font Style" />
      <FontWeight title="Font Weight" />
    </>
  );
}
