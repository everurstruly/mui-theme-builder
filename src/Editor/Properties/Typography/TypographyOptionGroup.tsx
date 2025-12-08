import { List } from "@mui/material";
import OptionGroupCollapse from "../../Toolbar/OptionGroupCollapse";

type TypographyOptionGroupProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function TypographyOptionGroup({
  title,
  children,
  defaultOpen,
}: TypographyOptionGroupProps) {
  return (
    <OptionGroupCollapse heading={title} defaultOpen={defaultOpen}>
      <List sx={{ padding: 0 }}>{children}</List>
    </OptionGroupCollapse>
  );
}
