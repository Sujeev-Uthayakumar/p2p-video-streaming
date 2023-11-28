import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const Form = ({ onFormSubmit }) => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleRoomNameChange = (event) => {
    setRoom(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFormSubmit(username, room);
  };
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={username}
        onChange={handleUsernameChange}
        label="Username"
        variant="filled"
      />
      <TextField
        value={room}
        onChange={handleRoomNameChange}
        label="Room ID"
        variant="filled"
      />
      <Button type="submit" onClick={handleSubmit} variant="contained">
        Join
      </Button>
    </form>
  );
};

export default Form;
