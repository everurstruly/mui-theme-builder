import { ListItem, Typography, Stack, type SelectChangeEvent } from "@mui/material";
import FontFamilyOptionInput from "./FontFamilyOptionInput";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useDesignCreatedTheme from "../../../Design/Edit/useCreatedTheme";
import { useDesignerEditTools } from "../../../Design/Edit/useDesignerEditTools";
import useThemeEdit from "../../../Design/Edit/useThemeEdit";

export type FontFamilyOptionProps = {
  title: string;
  path: string;
  disabled?: boolean;
};

const headingPaths = [
  "typography.h1.fontFamily",
  "typography.h2.fontFamily",
  "typography.h3.fontFamily",
  "typography.h4.fontFamily",
  "typography.h5.fontFamily",
  "typography.h6.fontFamily",
];

export default function FontFamilyOption({
  path,
  title,
  disabled,
}: FontFamilyOptionProps) {
  const {
    typography: { fontFamily },
  } = useDesignCreatedTheme();

  const { addGlobalVisualEdit, removeGlobalVisualEdit } = useDesignerEditTools();

  const { value, userEdit, isCodeControlled } = useThemeEdit(path);

  const autoResolvedValue = fontFamily;
  const resolvedValue = (value as string) ?? autoResolvedValue;
  const canResetValue = !!userEdit || !!isCodeControlled;

  const handleChange = (event: SelectChangeEvent) => {
    const selectedFont = event.target.value;
    const fontFamilyValue = formatFontFamilyWithFallback(selectedFont);

    if (path === "typography.h1.fontFamily") {
      headingPaths.forEach((p) => addGlobalVisualEdit(p, fontFamilyValue));
    } else {
      addGlobalVisualEdit(path, fontFamilyValue);
    }
  };
  
  const handleReset = () => {
    if (path === "typography.h1.fontFamily") {
      headingPaths.forEach((p) => removeGlobalVisualEdit(p));
    } else {
      removeGlobalVisualEdit(path);
    }
  };

  function getColor() {
    if (disabled) {
      return "text.disabled";
    }

    if (canResetValue) {
      return "warning.main";
    }

    return "text.primary";
  }

  return (
    <ListItem
      sx={{
        width: "auto",
        justifyContent: "space-between",
        paddingInline: 0,
        paddingBlock: 0.75,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <OptionListItemResetButton
          canResetValue={canResetValue}
          resetValue={handleReset}
          label={"Default"}
        />

        <Typography
          variant="caption"
          sx={{
            fontWeight: 400,
            fontSize: 12,
            color: getColor(),
          }}
        >
          {title}
        </Typography>
      </Stack>

      <FontFamilyOptionInput
        id={`font-family-select-${title}`}
        disabled={disabled || isCodeControlled}
        value={extractPrimaryFont(resolvedValue)}
        onChange={handleChange}
      />
    </ListItem>
  );
}

function formatFontFamilyWithFallback(selectedFont: string) {
  return selectedFont.includes(" ")
    ? `"${selectedFont}", sans-serif`
    : `${selectedFont}, sans-serif`;
}

// Extract primary font from full fontFamily string (e.g., "Roboto", "Helvetica", "Arial", sans-serif -> Roboto)
function extractPrimaryFont(fontFamily: string): string {
  const match = fontFamily.match(/^['"]?([^'",]+)['"]?/);
  return match ? match[1].trim() : fontFamily;
}
