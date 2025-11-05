import FontStyleSelectOption from "../FontStyle/FontStyleSelectOption";
import { Typography } from "@mui/material";
import FontWeightSelectOption from "../FontWeight/FontWeightSelectOption";
import FontStyleInputOption from "../FontStyle/FontStyleInputOption";

const placeholderSettings = {
  family: {
    initValue: { key: "fontFamily", value: "Roboto", title: "Roboto" },
    modifiedValue: { key: "fontFamily", value: "Arial", title: "Arial" },
  },
  weight: {
    initValue: { key: "fontWeight", value: "400" },
    modifiedValue: { key: "fontWeight", value: "400" },
  },
  lineHeight: {
    initValue: "1.1",
    modifiedValue: "1.1",
  },
  letterSpacing: {
    initValue: "0",
    modifiedValue: "0",
  },
};

type HeadlineTypographyProps = {
  title: string;
};

function HeadlineTypography(props: HeadlineTypographyProps) {
  return (
    <div>
      <Typography
        variant="subtitle2"
        component={"h6"}
        marginTop={5}
        paddingBlock={1}
        fontWeight={500}
        color="common.black"
        paddingInlineStart={0.35} // aesthetics alignment with list items badge
      >
        {props.title}{" "}
      </Typography>

      <FontWeightSelectOption
        name={"Font weight"}
        initValue={placeholderSettings.weight.initValue}
        modifiedValue={placeholderSettings.weight.modifiedValue}
      />

      <FontStyleInputOption
        name={"Letter Spacing"}
        initValue={placeholderSettings.letterSpacing.initValue}
        modifiedValue={placeholderSettings.letterSpacing.modifiedValue}
      />

      <FontStyleSelectOption
        name={"Line height"}
        initValue={placeholderSettings.lineHeight.initValue}
        modifiedValue={placeholderSettings.lineHeight.modifiedValue}
      />
    </div>
  );
}

export default HeadlineTypography;
