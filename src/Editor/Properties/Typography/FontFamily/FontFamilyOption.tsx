import { ListItem, Typography, Stack, type SelectChangeEvent } from "@mui/material";
import { useCallback } from "react";
import FontFamilyOptionInput from "./FontFamilyOptionInput";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useDesignCreatedTheme from "../../../Design/Current/useCreatedTheme";
import useEditProperty from "../../../Design/Current/Modify/useEditProperty";
import useCurrent from "../../../Design/Current/useCurrent";

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

  const { value, userEdit, isCodeControlled, setValue: setValueLocal, reset: resetLocal } = useEditProperty(path);

  // For batch operations (apply/reset across all headings) use the store-level
  // edit functions to avoid creating multiple subscriptions via hooks.
  const addGlobalDesignerEdit = useCurrent((s) => s.addNeutralDesignerEdit);
  const removeGlobalDesignerEdit = useCurrent((s) => s.removeNeutralDesignerEdit);

  const autoResolvedValue = fontFamily;
  const resolvedValue = (value as string) ?? autoResolvedValue;
  const canResetValue = !!userEdit || !!isCodeControlled;

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const selectedFont = event.target.value;
      const fontFamilyValue = formatFontFamilyWithFallback(selectedFont);

      if (path === "typography.h1.fontFamily") {
        // Apply to all heading variants using store function (no extra hooks)
        headingPaths.forEach((p) => addGlobalDesignerEdit(p, fontFamilyValue));
      } else {
        setValueLocal(fontFamilyValue);
      }
    },
    [path, setValueLocal, addGlobalDesignerEdit]
  );
  
  const handleReset = useCallback(() => {
    if (path === "typography.h1.fontFamily") {
      headingPaths.forEach((p) => removeGlobalDesignerEdit(p));
    } else {
      resetLocal();
    }
  }, [path, removeGlobalDesignerEdit, resetLocal]);

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
