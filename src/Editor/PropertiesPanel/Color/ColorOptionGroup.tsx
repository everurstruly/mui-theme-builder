import { Typography } from "@mui/material";

type ColorOptionGroupProps = {
  title: string;
  children: React.ReactNode;
};

export default function ColorOptionGroup(props: ColorOptionGroupProps) {
  return (
    <ul>
      <Typography
        variant="subtitle2"
        component={"h6"}
        marginTop={7}
        paddingBottom={1.8}
        fontWeight={500}
        color="common.black"
        paddingInlineStart={0.35} // aesthetics alignment with list items badge
      >
        {props.title}{" "}
        {/* <Typography
          component="span"
          fontSize={12}
          color="success.main"
          marginLeft={1}
        >
          Component
        </Typography> */}
      </Typography>

      {props.children}
    </ul>
  );
}
