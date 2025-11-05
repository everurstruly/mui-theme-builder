import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import PrimarySearchAppBar from "./Header";
import { Box } from "@mui/material";
import { mainListItems, secondaryListItems } from "./listItems";

const drawerWidth = 240;

const paperStyle = {
  p: 2,
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
};

export default function Dashboard() {
  return (
    <Paper>
      <PrimarySearchAppBar />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },

            "& .MuiDrawer-paper": {
              position: "static",
              whiteSpace: "nowrap",
              width: drawerWidth,
              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            },
          }}
        >
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>

        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper
                  sx={{
                    ...paperStyle,
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    ...paperStyle,
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid size={{ xs: 12 }}>
                <Paper sx={paperStyle}>
                  <Orders />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Paper>
  );
}
