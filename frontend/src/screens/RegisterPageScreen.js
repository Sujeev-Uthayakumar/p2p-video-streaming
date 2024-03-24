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

const RegisterPageScreen = ({ onRegister, switchAuthPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    password: false,
    confirmPassword: false,
    username: false,
  });

  const validateInput = () => {
    setError({
      password: password.trim() === "",
      confirmPassword: confirmPassword.trim() === "",
      username: username.trim() === "",
    });
    return (
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      username.trim() !== ""
    );
  };

  const handleSubmit = () => {
    if (validateInput()) {
      onRegister(username, password, confirmPassword);
    }
  };

  return (
    <div
      style={{
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
            mb: 5,
            padding: 9,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Register
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
            />
            <TextField
              error={error.password}
              helperText={error.password ? "Password is required" : ""}
              required
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              error={error.confirmPassword}
              helperText={
                error.confirmPassword ? "Confirm password is required" : ""
              }
              required
              id="confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={(event) => {
                  event.preventDefault();
                  switchAuthPage();
                }}
              >
                Already have an account? Login
              </Link>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default RegisterPageScreen;
