import { FullscreenRounded, TuneRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

// type PropertiesPanelSwitchProps = {
//   isShowingPropertyPanel: boolean;
//   handleShowPropertyPanel: (show: boolean) => void;
// };

const props = {
  isShowingPropertyPanel: false,
  handleShowPropertyPanel: (show: boolean) => void show,
};

export default function PropertiesPanelSwitch() {
  // props: PropertiesPanelSwitchProps
  return (
    <Button
      size="small"
      onClick={() =>
        props.handleShowPropertyPanel(!props.isShowingPropertyPanel)
      }
      sx={{
        minWidth: 0,
        width: "auto",
        paddingInline: 1,
        minHeight: 38,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      {props.isShowingPropertyPanel ? <FullscreenRounded /> : <TuneRounded />}
    </Button>
  );
}
