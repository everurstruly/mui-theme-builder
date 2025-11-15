import { ListItem, Typography, Stack } from "@mui/material";
import FontFamilyOptionInput from "./FontFamilyOptionInput";
import { useThemeDesignEditValue, useThemeDesignStore } from "../../../ThemeDesign";
import OptionListItemResetButton from "../../OptionListItemResetButton";

export type FontFamilyOptionProps = {
  name: string;
  path: string;
  templateValue: string;
  disabled?: boolean;
};

export default function FontFamilyOption(props: FontFamilyOptionProps) {
  const { value, hasVisualEdit, hasCodeOverride, reset } = 
    useThemeDesignEditValue(props.path);
  const store = useThemeDesignStore();

  // Detect if this is the headings control (path = typography.h1.fontFamily)
  const isHeadingsControl = props.path === 'typography.h1.fontFamily';

  // For headings: check if ANY h1-h6 has a visual edit
  const hasAnyHeadingEdit = isHeadingsControl && [
    'typography.h1.fontFamily',
    'typography.h2.fontFamily',
    'typography.h3.fontFamily',
    'typography.h4.fontFamily',
    'typography.h5.fontFamily',
    'typography.h6.fontFamily',
  ].some(p => {
    const scheme = store.activeColorScheme;
    const modeKey = scheme === 'light' ? 'lightMode' : 'darkMode';
    return p in store.baseVisualEdits || p in store[modeKey].visualEdits;
  });

  // Auto-inherit: when headings control has no edits, derive from base fontFamily
  const isAutoInheriting = isHeadingsControl && !hasAnyHeadingEdit && !hasCodeOverride;
  const baseFontFamily = store.baseVisualEdits['typography.fontFamily'] as string | undefined;

  // Current value priority: user edit > auto-inherit (base) > template default
  const currentValue = isAutoInheriting && baseFontFamily
    ? baseFontFamily
    : ((value as string) ?? props.templateValue);

  const canResetValue = (isHeadingsControl ? hasAnyHeadingEdit : hasVisualEdit) || hasCodeOverride;

  // Custom reset handler: for headings control, remove all h1-h6 visual edits
  const handleReset = () => {
    if (isHeadingsControl) {
      [
        'typography.h1.fontFamily',
        'typography.h2.fontFamily',
        'typography.h3.fontFamily',
        'typography.h4.fontFamily',
        'typography.h5.fontFamily',
        'typography.h6.fontFamily',
      ].forEach(p => store.removeVisualEdit(p));
    } else {
      reset();
    }
  };

  function getColor() {
    if (props.disabled) {
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
          label={isAutoInheriting ? "Auto" : "Default"}
          labelColor={isAutoInheriting ? "resolved" : undefined}
        />

        <Typography
          variant="caption"
          sx={{
            fontWeight: 400,
            fontSize: 12,
            color: getColor(),
          }}
        >
          {props.name}
        </Typography>
      </Stack>

      <FontFamilyOptionInput
        id={`font-family-select-${props.name}`}
        value={currentValue}
        disabled={props.disabled || hasCodeOverride}
        path={props.path}
      />
    </ListItem>
  );
}

