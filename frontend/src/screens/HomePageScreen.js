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
        background: "rgb(32,31,122)",
        background: "radial-gradient(circle, rgba(32,31,122,1) 15%, rgba(46,45,159,1) 45%, rgba(60,83,221,1) 85%, rgba(176,53,247,1) 95%)",  
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: '#18245c' }}>
        <Toolbar></Toolbar>
      </AppBar>
      <Container
        maxWidth="sm"
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(32,31,122,0)",
          p: 2,
          borderRadius: 20,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 3, width: "100%", mb: 5, padding: 9, borderRadius: 20, backgroundColor: "#040c34" }}
        >
          <Typography variant="h5" align="center" gutterBottom style={{ color: "white", fontFamily: 'Comfortaa, sans-serif', fontWeight: 'bold', fontSize: 35, paddingBottom: 20 }}>
            Enter Video Stream
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
              sx={{ backgroundColor: "white", borderRadius: 10}} 
            />
            <TextField
              error={error.username}
              helperText={error.username ? "Username is required" : ""}
              required
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 10 }} 
            />
            <Button
              variant="contained"
              style={{ 
                backgroundColor: "#324be6", 
                color: "white", 
                borderRadius: 20,
                marginTop: 25,
                fontFamily: 'Comfortaa, sans-serif',
                fontWeight: 'bold'
              }}
              onClick={() => handleSubmit()}
            >
              Join
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" align="center" gutterBottom style={{color: "white", fontFamily: 'Comfortaa, sans-serif'}}>
          {availableRooms.length !== 0
            ? "Available Rooms"
            : "Public Rooms: Unavailable"}
        </Typography>
        <ScrollableRoomList rooms={availableRooms} />
      </Container>
    </div>
  );
};

export default HomePage;
