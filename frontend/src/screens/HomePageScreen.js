// HomePage.js
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  CssBaseline,
  Link,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MenuIcon from "@mui/icons-material/Menu";
import ScrollableRoomList from "../components/ScrollableRoomList"; // Import the new component

const HomePage = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState({ roomId: false, username: false });

  const validateInput = () => {
    setError({
      roomId: roomId.trim() === "",
      username: username.trim() === "",
    });
    return roomId.trim() !== "" && username.trim() !== "";
  };

  const handleSubmit = () => {
    if (validateInput()) {
      // Implement your submit logic here
      console.log("Room ID:", roomId, "Username:", username);
    }
  };

  // Mock data for available rooms
  const availableRooms = [
    { id: "Room101", name: "General Chat" },
    { id: "Room102", name: "Tech Talk" },
    { id: "Room103", name: "Gaming Hub" },
    { id: "Room101", name: "General Chat" },
    { id: "Room102", name: "Tech Talk" },
    { id: "Room103", name: "Gaming Hub" },
    { id: "Room101", name: "General Chat" },
    { id: "Room102", name: "Tech Talk" },
    { id: "Room103", name: "Gaming Hub" },

    // Add more rooms as needed
  ];

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
          background: "rgba(255, 255, 255, 0.8)",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 3, width: "100%", mb: 5, paddingTop: 10 }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Join a Video Stream
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
              error={error.roomId}
              helperText={error.roomId ? "Room ID is required" : ""}
              required
              id="room-id"
              label="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <TextField
              error={error.username}
              helperText={error.username ? "Username is required" : ""}
              required
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Join Room
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" align="center" gutterBottom>
          Available Rooms
        </Typography>
        <ScrollableRoomList rooms={availableRooms} />
      </Container>
    </div>
  );
};

export default HomePage;
