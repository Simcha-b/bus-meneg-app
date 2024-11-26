import React from "react";
import { Typography, Button, Box, Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TrafficReports } from "../components/home-page/TrafficReports";
import Wether from "../components/home-page/Wether";

function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container maxWidth="xl" dir="rtl">
      <Box sx={{ py: 2 }}>
        <Grid container spacing={2}>
          {/* Notifications Section - Full Width */}
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                התראות מערכת
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 , font:"menu", color:"red"}}>
                <a href="#">יש 2 נסיעות השבוע שעדיין לא שובץ להם נהג</a>
                <a href="#">יש 3 לקוחות שיש להם חוב פתוח</a>
              </Box>
            </Paper>
          </Grid>

          {/* Main Actions Section */}
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                פעולות מהירות
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/orders")}
                  sx={{
                    width: 200,
                    height: 80,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  נסיעות
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/customers")}
                  sx={{
                    width: 200,
                    height: 80,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  לקוחות
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/operators")}
                  sx={{
                    width: 200,
                    height: 80,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  ספקים
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => navigate("/orders/new")}
                  sx={{
                    width: 200,
                    height: 80,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  הזמנה חדשה
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => navigate("/reports")}
                  sx={{
                    width: 200,
                    height: 80,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  דוחות
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Updates Section - Split into two columns */}
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                עדכוני מזג אויר
              </Typography>
              <Wether />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                עדכוני תנועה
              </Typography>
              <TrafficReports />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage;
