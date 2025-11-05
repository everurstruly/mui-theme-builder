import { Button, ListItem, Typography, Box, Stack } from "@mui/material";
import { useState } from "react";

type ColorGroupListtOptionProps = {
  name: string;
  initValue: string;
  modifiedValue: string;
};

export default function ColorGroupListOption(props: ColorGroupListtOptionProps) {
  const [colorBeingPicked, setColorBeingPicked] = useState(props.modifiedValue);

  function handleColorPicked(event: React.ChangeEvent<HTMLInputElement>) {
    console.log("New color selected:", event.target.value);
  }

  function handleColorBeingPicked(event: React.ChangeEvent<HTMLInputElement>) {
    setColorBeingPicked(event.target.value);
  }

  const canResetValue = props.initValue !== colorBeingPicked;
  const inputId = `color-${crypto.randomUUID()}`;

  return (
    <ListItem
      sx={{
        width: "auto",
        paddingInline: 0,
      }}
    >
      <Typography
        variant="caption"
        sx={{
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
            onClick={() => setColorBeingPicked(props.initValue)}
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
        {/* <IconButton sx={{ p: 0, fontSize: "caption.fontSize" }}>
          <ContentCopyOutlined
            sx={{
              fontSize: "inherit",
            }}
          />
        </IconButton> */}

        {props.name}
      </Typography>

      <Stack
        direction="row"
        marginInlineStart="auto"
        alignItems="center"
        spacing={1}
      >
        {/* <IconButton
          size="small"
          sx={{
            borderRadius: 1,
            paddingBlock: 0.25,
            paddingInline: 1,
          }}
        >
          <PaletteOutlined sx={{ fontSize: 20, color: "#888", strokeWidth: 1 }} />
        </IconButton> */}

        <Box
          component="label"
          htmlFor={inputId}
          sx={{
            width: 32,
            height: 20,
            bgcolor: colorBeingPicked,
            borderRadius: 1,
            border: 2,
            borderColor: "divider",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          <input
            id={inputId}
            type="color"
            name={inputId}
            defaultValue={props.modifiedValue}
            style={{ visibility: "hidden" }}
            onChange={handleColorPicked}
            onInput={handleColorBeingPicked}
          />
        </Box>
      </Stack>
    </ListItem>
  );
}
