import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Box, Button, Typography } from "@mui/material";
import { ContentCopyOutlined } from "@mui/icons-material";

export default function PrimaryColorsRelaxed() {
  return (
    <List
      sx={{
        bgcolor: "background.paper",
        position: "relative",
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
                    fontSize: 12,
                    color: "#555",
                  }}
                >
                  <Typography
                    color="green"
                    sx={{
                      backgroundColor: "#e0f8e0b7",
                      paddingInline: 0.75,
                      paddingBlock: 0.5,
                      borderRadius: 1,
                      fontSize: 10,
                    }}
                  >
                    Default
                  </Typography>

                  {/* <Button
                    sx={{
                      fontSize: 10,
                      paddingInline: 0.5,
                      paddingBlock: 0.5,
                      minWidth: "auto",
                      textTransform: "none",
                    }}
                  >
                    Reset
                  </Button> */}

                  {`Background ${item}`}
                </Typography>

                <Box
                  sx={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    columnGap: 2,
                    paddingInline: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 12, cursor: "pointer" }}>
                    #02802e
                    <ContentCopyOutlined
                      sx={{ marginInlineStart: 0.25, fontSize: 10 }}
                    />
                  </Typography>

                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "primary.main",
                      borderRadius: 100,
                      cursor: "pointer",
                      // boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                    }}
                  ></Box>
                </Box>
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}
