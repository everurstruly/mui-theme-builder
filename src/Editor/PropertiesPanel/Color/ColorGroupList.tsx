import { Typography } from "@mui/material";

type ColorGroupListProps = {
  title: string;
  children: React.ReactNode;
};

export default function ColorGroupList(props: ColorGroupListProps) {
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
