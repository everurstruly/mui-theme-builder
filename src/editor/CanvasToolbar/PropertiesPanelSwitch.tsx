import { FullscreenRounded, TuneRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

type PropertiesPanelSwitchProps = {
  isShowingPropertyPanel: boolean;
  handleShowPropertyPanel: (show: boolean) => void;
};

export default function PropertiesPanelSwitch(
  props: PropertiesPanelSwitchProps
) {
  return (
    <Button
      size="small"
      // color={props.isShowingPropertyPanel ? "inherit" : "primary"}
      color="inherit"
      onClick={() =>
        props.handleShowPropertyPanel(!props.isShowingPropertyPanel)
      }
      sx={{
        minWidth: 0,
        width: "auto",
        paddingInline: 1,
        minHeight: 38,
        boxShadow: "none",
      }}
    >
      {props.isShowingPropertyPanel ? <FullscreenRounded /> : <TuneRounded />}
    </Button>
  );
}
