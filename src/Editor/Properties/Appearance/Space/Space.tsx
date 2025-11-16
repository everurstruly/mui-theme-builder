import CssStyleInputOption from "../Styles/CssStyleInputOption";
import BatchToggleInput from "../../BatchToggleInput";
import { Divider, Stack, Typography } from "@mui/material";

// Density options as batch edits
const DENSITY_BATCH_EDITS = [
  {
    label: "Dense Buttons & Icon Buttons",
    description: "Applies size='small' to buttons and icon buttons",
    edits: {
      "components.MuiButton.defaultProps.size": "small",
      "components.MuiIconButton.defaultProps.size": "small",
    },
  },
  {
    label: "Dense Inputs & Forms",
    description: "Applies margin='dense' to all input components",
    edits: {
      "components.MuiFilledInput.defaultProps.margin": "dense",
      "components.MuiFormControl.defaultProps.margin": "dense",
      "components.MuiFormHelperText.defaultProps.margin": "dense",
      "components.MuiInputBase.defaultProps.margin": "dense",
      "components.MuiInputLabel.defaultProps.margin": "dense",
      "components.MuiOutlinedInput.defaultProps.margin": "dense",
      "components.MuiTextField.defaultProps.margin": "dense",
    },
  },
  {
    label: "Dense Tables",
    description: "Applies size='small' to tables",
    edits: {
      "components.MuiTable.defaultProps.size": "small",
    },
  },
  {
    label: "Dense Lists & Menus",
    description: "Applies dense=true to list items",
    edits: {
      "components.MuiListItem.defaultProps.dense": true,
    },
  },
  {
    label: "Dense Toolbars",
    description: "Applies variant='dense' to toolbars",
    edits: {
      "components.MuiToolbar.defaultProps.variant": "dense",
    },
  },
] as const;

type SpaceAppearanceProps = {
  title?: string;
};

export default function SpaceAppearance(props: SpaceAppearanceProps) {
  return (
    <div>
      <Typography
        variant="subtitle2"
        component={"h6"}
        marginTop={5}
        paddingBlock={1}
        fontWeight={500}
        paddingInlineStart={0.35} // aesthetics alignment with list items badge
      >
        {props.title}
      </Typography>

      <CssStyleInputOption name="Spacing Factor" path="spacing" />

      <Stack
        divider={<Divider />}
        sx={{
          mt: 3,
          px: 0,
        }}
      >
        {DENSITY_BATCH_EDITS.map((option) => (
          <BatchToggleInput
            key={option.label}
            label={option.label}
            description={option.description}
            edits={option.edits}
          />
        ))}
      </Stack>
    </div>
  );
}
