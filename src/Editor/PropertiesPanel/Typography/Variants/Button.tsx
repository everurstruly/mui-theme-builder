import FontFamilySelectOption from "../FontFamily/FontFamilySelectOption";
import FontWeightSelectOption from "../FontWeight/FontWeightSelectOption";
import { Typography } from "@mui/material";

const font = {
  title: "Button",
  family: {
    initValue: { key: "fontFamily", value: "Roboto", title: "Roboto" },
    modifiedValue: { key: "fontFamily", value: "Arial", title: "Arial" },
  },
  weight: {
    initValue: { key: "fontWeight", value: "400" },
    modifiedValue: { key: "fontWeight", value: "700" },
  },
  lineHeight: {
    initValue: "1.1",
    modifiedValue: "1.1",
  },
};

function ButtonTypography() {
  return (
    <div>
      <Typography
        variant="subtitle2"
        component={"h6"}
        marginTop={7}
        paddingBottom={1.8}
        fontWeight={500}
        color="common.black"
        paddingInlineStart={0.35} // aesthetics alignment with list items badge
      >
        {font.title}{" "}
        {/* <Typography
          component="span"
          fontSize={12}
          color="success.main"
          marginLeft={1}
        >
          Component
        </Typography> */}
      </Typography>

      <FontFamilySelectOption
        name={"Font family"}
        initValue={font.family.initValue}
        modifiedValue={font.family.modifiedValue}
      />

      <FontWeightSelectOption
        name={"Font weight"}
        initValue={font.weight.initValue}
        modifiedValue={font.weight.modifiedValue}
      />

      {/* <FontStyleSelectOption
        name={"Line height"}
        initValue={font.lineHeight.initValue}
        modifiedValue={font.lineHeight.modifiedValue}
      /> */}
    </div>
  );
}

export default ButtonTypography;
