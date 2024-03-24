import React, { useState, useEffect, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import SocketContext from "./components/SocketProvider";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";
import HomePage from "./screens/HomePageScreen";
import RegisterPage from "./screens/RegisterPageScreen";
import LoginPage from "./screens/LoginPageScreen";

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
  const [openRoomDeleted, setOpenRoomDeleted] = useState(false);
  const [switchAuthPage, setSwitchAuthPage] = useState(false);

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
      setOpenRoomDeleted(true);
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
          setOpenJoinedRoom(false);
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

  const handleCloseRoomDeleted = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenRoomDeleted(false);
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

  const handleRegister = (username, password, confirmPassword) => {
    console.log(username, password, confirmPassword);
  };

  const handleLogin = (username, password) => {
    console.log(username, password);
  };

  const userLoggedIn = () => {
    if (userJoined) {
      return (
        <VideoPlayerScreen
          handleUploadError={handleUploadError}
          handleUploadSuccess={handleUploadSuccess}
          resetUser={resetUser}
          room={room}
          username={username}
        />
      );
    } else {
      <HomePage onFormSubmit={handleFormSubmit} />;
    }
  };

  const handleSwitchAuthPage = () => {
    setSwitchAuthPage(!switchAuthPage);
  };

  const userLoggedOut = () => {
    if (switchAuthPage) {
      return (
        <LoginPage
          onLogin={handleLogin}
          switchAuthPage={handleSwitchAuthPage}
        />
      );
    } else {
      return (
        <RegisterPage
          onRegister={handleRegister}
          switchAuthPage={handleSwitchAuthPage}
        />
      );
    }
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
      <Snackbar
        open={openRoomDeleted}
        autoHideDuration={1000}
        onClose={handleCloseRoomDeleted}
      >
        <Alert
          onClose={handleCloseRoomDeleted}
          severity="error"
          sx={{ width: "100%" }}
        >
          The room was deleted
        </Alert>
      </Snackbar>
      {username ? userLoggedIn() : userLoggedOut()}
    </div>
  );
}

export default App;
