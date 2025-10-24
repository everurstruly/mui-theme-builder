import { Typography } from "@mui/material";

type ColorGroupProps = {
  title: string;
  children: React.ReactNode;
};

export default function FontList(props: ColorGroupProps) {
  return (
    <ul>
      <Typography
        fontSize={12}
        fontWeight={500}
        paddingInline={1.5}
        marginTop={4}
        paddingBlock={2}
      >
        {props.title}
      </Typography>

      {props.children}
    </ul>
  );
}
