import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import Form from "./components/Form";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";

const socket = io("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [userJoined, setUserJoined] = useState(false);

  const handleFormSubmit = (username, room) => {
    setUsername(username);
    setRoom(room);
    createAndJoinRoom();
  };

  useEffect(() => {
    socket.on("userJoined", (msg) => {
      alert(msg);
    });

    socket.on("userLeft", (msg) => {
      setUserJoined(false);
      alert(msg);
    });

    return () => {
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, []);

  const createAndJoinRoom = () => {
    if (room !== "") {
      socket.emit("joinRoom", { username, room });
      alert(`Created and joined room: ${room}`);
      setUserJoined(true);
    }
  };

  const leaveRoom = () => {
    if (room !== "") {
      socket.emit("leaveRoom", room);
    }
  };

  return (
    <div>
      {!userJoined ? (
        <Form onFormSubmit={handleFormSubmit} />
      ) : (
        <VideoPlayerScreen />
      )}
    </div>
  );
}

export default App;
