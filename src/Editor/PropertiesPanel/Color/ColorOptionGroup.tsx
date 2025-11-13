import { Typography } from "@mui/material";

type ColorOptionGroupProps = {
  title: string;
  children: React.ReactNode;
};

export default function ColorOptionGroup(props: ColorOptionGroupProps) {
  return (
    <>
      <Typography
        variant="subtitle2"
        component={"h6"}
        marginTop={6}
        paddingBottom={2}
        fontWeight={600}
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

      <ul>
        {props.children}
      </ul>
    </>
  );
}

