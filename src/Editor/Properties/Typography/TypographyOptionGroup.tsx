import { List, Typography } from "@mui/material";

type TypographyOptionGroupProps = {
  title: string;
  children: React.ReactNode;
};

export default function TypographyOptionGroup(props: TypographyOptionGroupProps) {
  return (
    <>
      <Typography
        variant="subtitle2"
        component={"h6"}
        marginTop={6}
        paddingBottom={1.5}
        fontWeight={600}
      >
        {props.title}
      </Typography>

      <List sx={{ padding: 0 }}>
        {props.children}
      </List>
    </>
  );
}
