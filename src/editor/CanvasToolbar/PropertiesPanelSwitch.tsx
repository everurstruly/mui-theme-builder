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
      color="inherit"
      // variant="outlined"
      onClick={() =>
        props.handleShowPropertyPanel(!props.isShowingPropertyPanel)
      }
      sx={(theme) => ({
        width: "auto",
        minWidth: 0,
        height: "fit-content",
        boxShadow: "none",
        paddingInline: 1,
        borderColor: "divider",
        marginTop: 0.5, // some weird alignment issue without this

        [theme.breakpoints.down("md")]: {
          display: "none",
        },
      })}
    >
      {props.isShowingPropertyPanel ? (
        <FullscreenRounded sx={{ fontSize: 28 }} />
      ) : (
        <TuneRounded sx={{ fontSize: 28 }} />
      )}
    </Button>
  );
}
