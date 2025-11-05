import {
  Button,
  Typography,
  TextField,
  ListItem,
  Box,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

export type StylesInputOptionProps = {
  name: string;
  initValue: string;
  modifiedValue: string;
  orientation?: "horizontal" | "vertical";
};

export default function ColorInputOption(props: StylesInputOptionProps) {
  const [colorIntensityBeingPicked, setColorIntensityBeingPicked] = useState(
    props.modifiedValue
  );

  const canResetValue = props.initValue !== colorIntensityBeingPicked;

  return (
    <ListItem
      component="div"
      sx={{
        width: "auto",
        paddingInline: 0,
        justifyContent: "space-between",
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        flexDirection: props.orientation === "vertical" ? "column" : "row",
        gap: props.orientation === "vertical" ? 1 : 0,
        paddingBlock: 0.75,
        columnGap: 1,
      }}
    >
      <Typography
        component="div"
        variant="caption"
        sx={{
          marginRight: "auto",
          display: "flex",
          alignItems: "center",
          columnGap: 0.75,
          // color: canResetValue ? "warning.main" : "text.primary",
          cursor: "pointer",
          fontWeight: 400,
          textTransform: "capitalize",
        }}
      >
        {!canResetValue && (
          <Typography
            color="green"
            sx={{
              p: 0.5,
              fontSize: 10,
              lineHeight: 1,
              backgroundColor: "#e0f8e089",
            }}
          >
            Default
          </Typography>
        )}

        {canResetValue && (
          <Button
            color="warning"
            onClick={() => setColorIntensityBeingPicked(props.initValue)}
            sx={{
              lineHeight: 1,
              fontSize: 10,
              padding: 0.5,
              fontWeight: 400,
              minWidth: "auto",
            }}
          >
            Reset
          </Button>
        )}

        {props.name}
      </Typography>

      <Tooltip title={"Action shade color intensity"}>
        <TextField
          size="small"
          value={colorIntensityBeingPicked}
          onChange={(e) => setColorIntensityBeingPicked(e.target.value)}
          sx={{
            flexBasis: props.orientation === "vertical" ? "100%" : "auto",

            minHeight: 0,
            height: "fit-content",
            paddingBlock: 0,

            "& .MuiInputBase-input": {
              maxWidth: "8ch",
              fontSize: "caption.fontSize",
              textAlign: "center",
              paddingInline: 0,
              paddingBlock: 0.5,
            },
          }}
        />
      </Tooltip>

      <Box
        sx={{
          width: 32,
          height: 20,
          bgcolor: `rgba(0, 0, 0, 0${colorIntensityBeingPicked})`,
          borderRadius: 1,
          border: 2,
          borderColor: "divider",
          cursor: "pointer",
          display: "inline-block",
        }}
      />
    </ListItem>
  );
}
