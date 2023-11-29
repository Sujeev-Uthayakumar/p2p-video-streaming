import React, { useState, useEffect, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import SocketContext from "./components/SocketProvider";
import Form from "./components/Form";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const socket = useContext(SocketContext);

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [userJoined, setUserJoined] = useState(false);
  const [open, setOpen] = useState(false);
  const [needVideo, setNeedVideo] = useState(null);

  const handleFormSubmit = (username, room) => {
    setUsername(username);
    setRoom(room);
    createAndJoinRoom();
  };

  useEffect(() => {
    socket.on("userLeft", (msg) => {
      setUserJoined(false);
      alert(msg);
    });

    return () => {
      socket.off("userLeft");
    };
  });

  const createAndJoinRoom = () => {
    if (room !== "") {
      socket.emit("joinRoom", { username, room });
      setUserJoined(true);
      setOpen(true);
    }
  };

  const leaveRoom = () => {
    if (room !== "") {
      socket.emit("leaveRoom", room);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  console.log(needVideo);

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Successfully entered room: {room}
        </Alert>
      </Snackbar>
      {!userJoined ? (
        <Form onFormSubmit={handleFormSubmit} />
      ) : (
        <VideoPlayerScreen room={room} username={username} />
      )}
    </div>
  );
}

export default App;
