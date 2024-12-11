import React, { useRef, useState } from "react";
import { TextField, Button, Box, Typography, Container, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/loginServis.js";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import InputAdornment from '@mui/material/InputAdornment';
import GoogleIcon from '@mui/icons-material/Google';
import "../css/login.css";

function Login() {
  const navigate = useNavigate(); 
  const [error, setError] = useState(null);
  const email = useRef();
  const password = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      
      if (!email.current.value || !password.current.value) {
        throw new Error("נא למלא את כל השדות");
      }
      
      const user = await loginUser(
        email.current.value,
        password.current.value
      );
      
      if (!user) {
        throw new Error("שם משתמש או סיסמה שגויים. אנא נסה שנית.");
      }
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    // try {
    //   const user = await loginWithGoogle();
    //   console.log("User logged in with Google:", user);
    //   navigate("/home");
    // } catch (error) {
    //   setError("שגיאה בהתחברות עם גוגל");
    // }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        marginBottom: '20px'
      }}>
        <DirectionsBusIcon sx={{ fontSize: 40, color: 'white' }} />
        <Typography
          sx={{
            color: 'white',
            fontSize: '30px',
            fontWeight: 'bold',
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          בדרך הישר - מערכת ניהול
        </Typography>
      </Box>

      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ 
              fontFamily: "'Open Sans', sans-serif",
              color: '#1e3c72',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}
          >
            התחברות למערכת
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label="אימייל"
              name="email"
              inputRef={email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#1e3c72' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1e3c72',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="סיסמה"
              type="password"
              id="password"
              inputRef={password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#1e3c72' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1e3c72',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)',
                height: '48px',
                boxShadow: '0 3px 5px 2px rgba(30, 60, 114, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #162b52 30%, #1e3c72 90%)',
                },
              }}
            >
              כניסה
            </Button>

            <Divider sx={{ my: 2, width: '100%' }}>
              <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>
                או
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              sx={{
                mb: 2,
                color: '#757575',
                borderColor: '#757575',
                height: '48px',
                '&:hover': {
                  borderColor: '#1e3c72',
                  color: '#1e3c72',
                  backgroundColor: 'rgba(30, 60, 114, 0.04)'
                },
              }}
            >
              התחברות עם Google
            </Button>
            
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 2,
                  textAlign: 'center',
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  border: '1px solid rgba(211, 47, 47, 0.3)'
                }}
              >
                ⚠️ {"שם משתמש או סיסמה לא נכונים"}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
