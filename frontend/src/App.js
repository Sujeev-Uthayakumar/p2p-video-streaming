import React, { useState, useEffect, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import SocketContext from "./components/SocketProvider";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";
import HomePage from "./screens/HomePageScreen";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const socket = useContext(SocketContext);

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [userJoined, setUserJoined] = useState(false);
  const [openJoinedRoom, setOpenJoinedRoom] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openUploadSuccess, setUploadSuccess] = useState(false);
  const [openUploadError, setUploadError] = useState(false);

  const handleFormSubmit = (username, room) => {
    setUsername(username);
    setRoom(room);
    createAndJoinRoom(username, room);
  };

  useEffect(() => {
    socket.on("userLeft", (msg) => {
      // alert(msg);
    });

    socket.on("roomDeleted", (room) => {
      resetUser();
    });

    return () => {
      socket.off("userLeft");
    };
  }, []);

  const createAndJoinRoom = (username, room) => {
    if (room !== "") {
      let isError = false;

      socket.emit("joinRoom", { username, room }, (error) => {
        if (error) {
          isError = true;
          setUserJoined(false);
          setOpenError(true);
        }
      });
      if (!isError) {
        setUserJoined(true);
        setOpenJoinedRoom(true);
      }
    }
  };

  const handleCloseJoinedRoom = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenJoinedRoom(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  };

  const handleCloseUploadSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUploadSuccess(false);
  };

  const handleCloseUploadError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUploadError(false);
  };

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
  };

  const handleUploadError = () => {
    setUploadError(true);
  };

  const resetUser = () => {
    setUsername("");
    setRoom("");
    setUserJoined(false);
  };

  return (
    <div>
      <Snackbar
        open={openJoinedRoom}
        autoHideDuration={1000}
        onClose={handleCloseJoinedRoom}
      >
        <Alert
          onClose={handleCloseJoinedRoom}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully entered room: {room}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openUploadError}
        autoHideDuration={1000}
        onClose={handleCloseUploadError}
      >
        <Alert
          onClose={handleCloseUploadError}
          severity="error"
          sx={{ width: "100%" }}
        >
          Uploading the video failed
        </Alert>
      </Snackbar>
      <Snackbar
        open={openUploadSuccess}
        autoHideDuration={1000}
        onClose={handleCloseUploadSuccess}
      >
        <Alert
          onClose={handleCloseUploadSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Upload successful
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError}
        autoHideDuration={1000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          The username is already taken
        </Alert>
      </Snackbar>
      {!userJoined ? (
        <HomePage onFormSubmit={handleFormSubmit} />
      ) : (
        <VideoPlayerScreen
          handleUploadError={handleUploadError}
          handleUploadSuccess={handleUploadSuccess}
          resetUser={resetUser}
          room={room}
          username={username}
        />
      )}
    </div>
  );
}

export default App;
