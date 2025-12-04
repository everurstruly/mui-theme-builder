import { Box, Typography } from "@mui/material";

type DialogHeadingProps = {
  title: string;
  Icon: React.ElementType;
};

function DialogHeading({ title, Icon }: DialogHeadingProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", columnGap: 2 }}>
      {Icon && <Icon sx={{ color: "primary.main" }} />}
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
  );
}

export default DialogHeading;
