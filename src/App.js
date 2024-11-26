// import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { heIL } from "@mui/material/locale";
import { heIL as dateheIL } from "@mui/x-date-pickers/locales";

import Orders from "./pages/Orders";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

import HomePage from "./pages/HomePage";
import NewOrder from "./pages/NewOrder";
import Login from "./pages/Login";
import ProtectedPages from "./pages/ProtectedPages";
import Layout from "./components/layout-com/Layout";
import Customers from "./pages/Customers";
import Companies from "./pages/Companies";
import NotFoundPage from "./pages/NotFoundPage";
import Reports from "./pages/Reports";
const queryClient = new QueryClient();

  const theme = createTheme(
    {
      palette: {
        primary: {
          main: '#1B365D',     // Deep navy
          dark: '#102440',
          light: '#2C4875',
        },
        secondary: {
          main: '#E6BE8A',     // Champagne gold
          dark: '#C9A36F',
          light: '#F2D4A7',
        },
        background: {
          default: '#F8F8F8',  // Light gray background
          paper: '#FFFFFF',    // Pure white
        },
        text: {
          primary: '#2C2C2C',  // Dark gray text
          secondary: '#666666', // Medium gray text
        }
      },
      typography: {
        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 300 },
        h2: { fontWeight: 300 },
        button: { fontWeight: 500 }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              textTransform: 'none',
            }
          }
        }
      },
      direction: "rtl",
    },
    heIL,
    dateheIL
  );



const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cacheRtl}>
        <Router>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedPages />}>
                <Route element={<Layout />}>
                  <Route path="/home" element={<HomePage />}></Route>
                  <Route path="/orders" element={<Orders />}></Route>
                  <Route path="orders/new" element={<NewOrder />} />
                  <Route path="orders/:orderId" element={<NewOrder />} />
                  <Route path="bus-company" element={<Companies />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="reports" element={<Reports />} />
                  {/* <Route path="distance" element={<Distance />} /> */}
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </QueryClientProvider>
        </Router>
      </CacheProvider>
    </ThemeProvider>
  );
}

export default App;
