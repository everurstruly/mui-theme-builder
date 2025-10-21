import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Box, Typography } from "@mui/material";

export default function PrimaryColorsRelaxed() {
  return (
    <List
      sx={{
        bgcolor: "background.paper",
        position: "relative",
        maxHeight: "calc(100vh - 120px)",
        overflow: "auto",
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      {[0, 1, 2, 3, 4].map((sectionId) => (
        <li key={`section-${sectionId}`}>
          <ul>
            <Typography
              fontSize={12}
              fontWeight={500}
              paddingInline={1.5}
              marginTop={4}
              paddingBlock={2}
            >{`Color ${sectionId}`}</Typography>

            {[0, 1, 2].map((item) => (
              <ListItem
                key={`item-${sectionId}-${item}`}
                sx={{
                  width: "auto",
                  paddingInline: 1,
                }}
              >
                <Typography
                  component={"div"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: 0.75,
                    fontWeight: 400,
                    fontSize: 14,
                    color: "#555",
                  }}
                >
                  <Typography
                    color="green"
                    fontSize={10}
                    sx={{
                      backgroundColor: "#e0f8e0b7",
                      paddingInline: 0.75,
                      paddingBlock: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    Default
                  </Typography>

                  {`Item ${item}`}
                </Typography>

                <Box
                  sx={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    columnGap: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: 12 }}>#02802e</Typography>
                  <Box sx={{ width: 16, height: 16, bgcolor: "red" }}></Box>
                </Box>
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}
