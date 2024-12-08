import React, { useRef, useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { checkLogin, loginUser, loginWithGoogle, registerUser } from "../services/loginServis.js";
import "../css/login.css";

function Login() {
  const navigate = useNavigate(); 
  const [error, setError] = useState(null);
  const email = useRef();
  const password = useRef();
  // const username = useRef();
  // const [showRegister, setShowRegister] = useState(false);

  // Handles the login process
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
      console.log("User logged in:", user);
      
      if (!user) throw new Error("שם משתמש או סיסמה לא נכונים");
      navigate("/home");
    } catch (error) {
      setError(error.message || "שם משתמש או סיסמה לא נכונים");
    }
  };

  // Handles login with Google
  // const handleGoogleLogin = async () => {
  //   try {
  //     const user = await loginWithGoogle();
  //     console.log("User logged in with Google:", user);
  //     localStorage.setItem("token", user.accessToken); // Store token in local storage
  //     navigate("/home"); // Updated to navigate to home page
  //   } catch (error) {
  //     setError("שגיאה בהתחברות עם גוגל");
  //   }
  // };

  // // Handles user registration
  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   try {
  //     if (!email.current.value || !password.current.value || !username.current.value) {
  //       throw new Error("שדות חסרים");
  //     }
  //     const user = await registerUser(
  //       email.current.value,
  //       password.current.value,
  //       username.current.value
  //     );
  //     console.log("User registered:", user);
  //     navigate("/home");
  //   } catch (error) {
  //     setError(error.message || "רישום נכשל");
  //   }
  // };

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          margin: "20px",
          fontSize: "30px",
          fontWeight: "bold",
          fontFamily: "'Roboto', sans-serif", // Apply Roboto font
        }}
      >
בדרך הישר - מערכת ניהול      </h1>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: "#f0f4f8",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            התחברות
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
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
              // onChange={(e) =>  setPassword(email)}
              autoFocus
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
              // onChange={(e) => setPassword(password)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              כניסה
            </Button>
            {/* <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                onClick={handleGoogleLogin}
                sx={{ flexGrow: 1, mr: 1 }}
              >
                התחבר עם גוגל
                <img
                  src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                  alt="logo"
                  height={"20px"}
                  width={"20px"}
                />
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowRegister(!showRegister)}
                sx={{ flexGrow: 1, ml: 1 }}
              >
                {showRegister ? "ביטול" : "עדיין לא רשום?"}
              </Button>
            </Box> */}
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
          {/* {showRegister && (
            <Box
              component="form"
              onSubmit={handleRegister}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="register-email"
                type="email"
                label="אימייל"
                name="email"
                inputRef={email}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="סיסמה"
                type="password"
                id="register-password"
                inputRef={password}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="שם משתמש"
                type="text"
                id="register-username"
                inputRef={username}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                רישום
              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </Box>
          )} */}
        </Box>
      </Container>
    </>
  );
}

export default Login;
