import { Stack } from "@mui/material";
import DesignColorSchemeToggle from "../Activities/DesignColorSchemeToggle";

export default function PropertiesPanelHeader() {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      // marginTop={2}
      paddingY={2.5}
      paddingX={1.5}
    >
      {/* <Typography variant="body2">
        {selectedTab?.propsPanelTitle || `${selectedTab?.title} Properties`}
      </Typography> */}

      <DesignColorSchemeToggle />
    </Stack>
  );
}

