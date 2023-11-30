// HomePage.js
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";

import ScrollableRoomList from "../components/ScrollableRoomList"; // Import the new component

const HomePage = ({ onFormSubmit }) => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState({ room: false, username: false });
  const [availableRooms, setAvailableRooms] = useState([]);

  const validateInput = () => {
    setError({
      room: room.trim() === "",
      username: username.trim() === "",
    });
    return room.trim() !== "" && username.trim() !== "";
  };

  const handleSubmit = () => {
    if (validateInput()) {
      onFormSubmit(username, room);
    }
  };

  useEffect(() => {
    getAvailableRooms();
  }, []);

  const getAvailableRooms = async () => {
    const response = await axios.get("http://localhost:3001/rooms");

    setAvailableRooms(response.data);
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
              error={error.room}
              helperText={error.room ? "Room ID is required" : ""}
              required
              id="room-id"
              label="Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Join Room
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" align="center" gutterBottom>
          {availableRooms.length !== 0
            ? "Available Rooms"
            : "No Public Rooms Available"}
        </Typography>
        <ScrollableRoomList rooms={availableRooms} />
      </Container>
    </div>
  );
};

export default HomePage;
