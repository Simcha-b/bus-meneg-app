import React from "react";
import { Typography, Box, Container, Paper, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { TrafficReports } from "../components/home-page/TrafficReports";
import Wether from "../components/home-page/Wether";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function HomePage() {
  const navigate = useNavigate();

  const actionItems = [
    { title: 'נסיעות', icon: <DirectionsBusIcon />, path: '/orders', color: 'primary.main' },
    { title: 'לקוחות', icon: <GroupIcon />, path: '/customers', color: 'secondary.main' },
    { title: 'ספקים', icon: <BusinessIcon />, path: '/operators', color: 'success.main' },
    { title: 'הזמנה חדשה', icon: <AddCircleIcon />, path: '/orders/new', color: 'warning.main' },
    { title: 'דוחות', icon: <AssessmentIcon />, path: '/reports', color: 'info.main' },
  ];

  return (
    <Container maxWidth="xl" dir="rtl">
      <Box sx={{ py: 3 }}>
        <Grid container spacing={3} >
          {/* Quick Actions - Top Section */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>פעולות מהירות</Typography>
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                justifyContent: 'center',
                maxWidth: 800,
                margin: '0 auto'
              }}>
                {actionItems.map((item) => (
                  <Box key={item.path} sx={{ textAlign: 'center' }}>
                    <IconButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        width: 90,
                        height: 90,
                        backgroundColor: item.color,
                        '&:hover': {
                          backgroundColor: item.color,
                          opacity: 0.9,
                          transform: 'translateY(-3px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {React.cloneElement(item.icon, { sx: { fontSize: 40, color: 'white' } })}
                    </IconButton>
                    <Typography sx={{ mt: 1, fontWeight: 500 }}>{item.title}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Notifications Panel */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <NotificationsActiveIcon color="error" />
                <Typography variant="h6">התראות מערכת</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, color: "error.main" }}>
                <Typography variant="body1" component="a" href="#" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  • יש 2 נסיעות השבוע שעדיין לא שובץ להם נהג
                </Typography>
                <Typography variant="body1" component="a" href="#" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  • יש 3 לקוחות שיש להם חוב פתוח
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Updates Section - Two Columns */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>עדכוני מזג אויר</Typography>
              <Wether />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>עדכוני תנועה</Typography>
              <TrafficReports />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage;
