import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const data = {
  monthlyStats: [
    { month: 'ינואר', לקוחות: 45, ספקים: 12, הכנסות: 85000 },
    { month: 'פברואר', לקוחות: 52, ספקים: 14, הכנסות: 92000 },
    { month: 'מרץ', לקוחות: 58, ספקים: 15, הכנסות: 98000 },
    { month: 'אפריל', לקוחות: 65, ספקים: 16, הכנסות: 70000 },
    { month: 'מאי', לקוחות: 72, ספקים: 18, הכנסות: 115000 },
    { month: 'יוני', לקוחות: 80, ספקים: 20, הכנסות: 125000 }
  ],
  monthlyTrends: [
    { month: 'ינואר', עסקאות_חודשיות: 125, אחוז_צמיחה: 5 },
    { month: 'פברואר', עסקאות_חודשיות: 140, אחוז_צמיחה: 8 },
    { month: 'מרץ', עסקאות_חודשיות: 155, אחוז_צמיחה: 12 },
    { month: 'אפריל', עסקאות_חודשיות: 150, אחוז_צמיחה: 20 },
    { month: 'מאי', עסקאות_חודשיות: 200, אחוז_צמיחה: 18 },
    { month: 'יוני', עסקאות_חודשיות: 225, אחוז_צמיחה: 20 }
  ]
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: 140,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4]
  }
}));

const ChartPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6]
  }
}));

const StatCard = ({ title, value, icon: Icon, trend }) => {
  const theme = useTheme();
  
  return (
    <StyledPaper elevation={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ 
          bgcolor: 'primary.light', 
          p: 1, 
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon sx={{ color: 'primary.main' }} />
        </Box>
        {trend && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'success.main',
              fontWeight: 'medium' 
            }}
          >
            +{trend}%
          </Typography>
        )}
      </Box>
      <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {value}
      </Typography>
    </StyledPaper>
  );
};

const Dashboard = () => {
  const [activeChart, setActiveChart] = useState('combined');
  const theme = useTheme();

  const formatNumber = (num) => {
    return new Intl.NumberFormat('he-IL').format(num);
  };

  const handleChartChange = (event, newValue) => {
    if (newValue !== null) {
      setActiveChart(newValue);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: 'primary.main',
          fontWeight: 700,
          textAlign: 'center',
          mb: 4
        }}
      >
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="לקוחות פעילים"
            value={formatNumber(80)}
            icon={PeopleIcon}
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="ספקים פעילים"
            value={formatNumber(20)}
            icon={BusinessIcon}
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="הכנסות החודש"
            value={`₪${formatNumber(125000)}`}
            icon={AccountBalanceWalletIcon}
            trend={15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="אחוז צמיחה"
            value="20%"
            icon={TrendingUpIcon}
            trend={20}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <ChartPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                מגמות חודשיות
              </Typography>
              <ToggleButtonGroup
                value={activeChart}
                exclusive
                onChange={handleChartChange}
                size="small"
              >
                <ToggleButton value="combined">
                  משולב
                </ToggleButton>
                <ToggleButton value="customers">
                  לקוחות
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: theme.shape.borderRadius,
                      border: 'none',
                      boxShadow: theme.shadows[3]
                    }}
                  />
                  <Legend />
                  {(activeChart === 'combined' || activeChart === 'customers') && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="לקוחות"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={{ fill: theme.palette.primary.main, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {activeChart === 'combined' && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="הכנסות"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      dot={{ fill: theme.palette.success.main, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </ChartPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartPaper>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              עסקאות חודשיות
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: theme.shape.borderRadius,
                      border: 'none',
                      boxShadow: theme.shadows[3]
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="עסקאות_חודשיות"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;