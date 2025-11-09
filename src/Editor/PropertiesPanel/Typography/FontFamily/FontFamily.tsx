import { AddRounded } from "@mui/icons-material";
import FontFamilyOption from "./FontFamilyOption";
import { IconButton, Stack, Typography } from "@mui/material";

const fontSettings = {
  title: "Font Family",
  families: [
    {
      name: "Headings & Subtitles",
      initValue: { key: "fontFamily", value: "Roboto", title: "Roboto" },
      modifiedValue: { key: "fontFamily", value: "Arial", title: "Arial" },
    },
    {
      name: "Body & Captions",
      initValue: { key: "fontFamily", value: "Roboto", title: "Roboto" },
      modifiedValue: { key: "fontFamily", value: "Arial", title: "Arial" },
    },
  ],
};

function FontFamilyTypography() {
  return (
    <div>
      <Stack
        direction="row"
        fontSize={14}
        fontWeight={600}
        marginTop={5}
        paddingBlock={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="subtitle2"
          component={"h6"}
          fontWeight={500}
          color="common.black"
        >
          {fontSettings.title}{" "}
          {/* <Typography
          component="span"
          fontSize={12}
          color="success.main"
          marginLeft={1}
        >
          Component
        </Typography> */}
        </Typography>

        <IconButton size="small">
          <AddRounded sx={{ fontSize: "h6.fontSize", lineHeight: 1 }} />
        </IconButton>
      </Stack>

      {fontSettings.families.map((family) => (
        <FontFamilyOption
          key={family.name}
          name={family.name}
          initValue={family.initValue}
          modifiedValue={family.modifiedValue}
        />
      ))}
    </div>
  );
}

export default FontFamilyTypography;
