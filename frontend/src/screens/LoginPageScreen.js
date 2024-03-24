import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CssBaseline,
  AppBar,
  Toolbar,
  Link,
} from "@mui/material";

const LoginPageScreen = ({ onLogin, switchAuthPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    password: false,
    confirmPassword: false,
    username: false,
  });

  const validateInput = () => {
    setError({
      password: password.trim() === "",
      username: username.trim() === "",
    });
    return password.trim() !== "" && username.trim() !== "";
  };

  const handleSubmit = () => {
    if (validateInput()) {
      onLogin(username, password);
    }
  };

  return (
    <div
      style={{
        background: "rgb(32,31,122)",
        background: "radial-gradient(circle, rgba(32,31,122,1) 30%, rgba(50,75,230,1) 75%, rgba(176,53,247,1) 99%)",
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <CssBaseline />
      <AppBar position="static">
        <Toolbar></Toolbar>
      </AppBar>
      <Container
        maxWidth="sm"
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          borderRadius: 20,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: "100%",
            backgroundColor: "#040c34",
            borderRadius: 20,
            mb: 5,
            padding: 9,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom style={{ color: "white", fontFamily: 'Comfortaa, sans-serif', fontWeight: 'bold', fontSize: 35, paddingBottom: 20 }}>
            Login
          </Typography>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
              "& .MuiButton-root": { m: 1, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              error={error.username}
              helperText={error.username ? "Username is required" : ""}
              required
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 10}}
            />
            <TextField
              error={error.password}
              type="password"
              helperText={error.password ? "Password is required" : ""}
              required
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 10}}
            />
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={(event) => {
                  event.preventDefault();
                  switchAuthPage();
                }}
                sx={{ fontFamily: 'Comfortaa, sans-serif', fontWeight: 'bold',}}
              >
                Need an account? Register
              </Link>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              style={{ 
                backgroundColor: "#324be6", 
                color: "white", 
                borderRadius: 20,
                marginTop: 25,
                fontFamily: 'Comfortaa, sans-serif',
                fontWeight: 'bold'
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPageScreen;
