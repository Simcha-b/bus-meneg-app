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

function HomePageAdmin() {
  const navigate = useNavigate();

  const actionItems = [
    { title: 'נסיעות', icon: <DirectionsBusIcon />, path: '/orders', color: 'primary.main' },
    { title: 'לקוחות', icon: <GroupIcon />, path: '/customers', color: 'secondary.main' },
      { title: 'ספקים', icon: <BusinessIcon />, path: '/bus-company', color: 'success.main' },
    { title: 'הזמנה חדשה', icon: <AddCircleIcon />, path: '/orders/new', color: 'warning.main' },
    { title: 'דוחות', icon: <AssessmentIcon />, path: '/reports', color: 'info.main' },
  ];

  return (
    <Container maxWidth="xl" dir="rtl">
      <Box sx={{ py: 4, backgroundColor: "background.default" }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Notifications */}
          <Grid xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsActiveIcon color="error" sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>התראות מערכת</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body1" component="a" href="#" sx={{
                  textDecoration: 'none',
                  color: 'error.main',
                  '&:hover': { textDecoration: 'underline' },
                }}>
                  • יש 2 נסיעות השבוע שעדיין לא שובץ להם נהג
                </Typography>
                <Typography variant="body1" component="a" href="#" sx={{
                  textDecoration: 'none',
                  color: 'error.main',
                  '&:hover': { textDecoration: 'underline' },
                }}>
                  • יש 3 לקוחות שיש להם חוב פתוח
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid xs={12}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>פעולות מהירות</Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 5,
                justifyContent: 'center',
              }}>
                {actionItems.map((item) => (
                  <Box key={item.path} sx={{ textAlign: 'center' }}>
                    <IconButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: item.color,
                        borderRadius: "16px",
                        boxShadow: 3,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 6,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {React.cloneElement(item.icon, { sx: { fontSize: 50, color: 'white' } })}
                    </IconButton>
                    <Typography sx={{ mt: 2, fontWeight: 'medium', fontSize: '1rem' }}>{item.title}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Updates */}
          <Grid xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>עדכוני מזג אויר</Typography>
              <Wether />
            </Paper>
          </Grid>
          <Grid xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, minHeight: 200 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>עדכוני תנועה</Typography>
              <TrafficReports />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePageAdmin;
