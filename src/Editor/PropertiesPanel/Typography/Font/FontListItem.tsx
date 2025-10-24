import { ContentCopyOutlined } from "@mui/icons-material";
import { Button, ListItem, Typography, Box } from "@mui/material";

export type FontListItemProps = {
  name: string;
  initValue: string;
  modifiedValue: string;
};

export default function FontListItem(props: FontListItemProps) {
  const canResetValue = props.initValue !== props.modifiedValue;

  return (
    <ListItem
      sx={{
        width: "auto",
        paddingInline: 1,
      }}
    >
      <Typography
        component={"div"}
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 0.75,
          fontWeight: 400,
          fontSize: 12,
          color: "#555",
          textTransform: "capitalize",
        }}
      >
        {!canResetValue && (
          <Typography
            color="green"
            sx={{
              backgroundColor: "#e0f8e0b7",
              paddingInline: 0.625,
              paddingBlock: 0.5,
              borderRadius: 1,
              fontSize: 10,
            }}
          >
            Default
          </Typography>
        )}

        {canResetValue && (
          <Button
            sx={{
              fontSize: 10,
              paddingInline: 0.5,
              paddingBlock: 0.5,
              minWidth: "auto",
              textTransform: "none",
            }}
          >
            Reset
          </Button>
        )}

        {props.name}
      </Typography>

      <Box
        sx={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          columnGap: 2,
          paddingInline: 1,
        }}
      >
        <Typography sx={{ fontSize: 12, cursor: "pointer" }}>
          {props.initValue}
          <ContentCopyOutlined
            sx={{ marginInlineStart: 0.25, fontSize: 10, color: "#888" }}
          />
        </Typography>
      </Box>
    </ListItem>
  );
}
