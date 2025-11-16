import { ListItem, Typography, Stack } from "@mui/material";
import FontFamilyOptionInput from "./FontFamilyOptionInput";
import { useThemeDesignEditValue } from "../../../Design";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useDesignCreatedTheme from "../../../Design/useDesignCreatedTheme";

export type FontFamilyOptionProps = {
  title: string;
  path: string;
  disabled?: boolean;
};

export default function FontFamilyOption({
  path,
  title,
  disabled,
}: FontFamilyOptionProps) {
  const {
    typography: { fontFamily },
  } = useDesignCreatedTheme();

  const { value, hasVisualEdit, hasCodeOverride, reset } =
    useThemeDesignEditValue(path);

  const autoResolvedValue = fontFamily;
  const resolvedValue = value ?? autoResolvedValue;
  const canResetValue = hasVisualEdit || hasCodeOverride;

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
          resetValue={reset}
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
        value={resolvedValue}
        disabled={disabled || hasCodeOverride}
        path={path}
      />
    </ListItem>
  );
}
