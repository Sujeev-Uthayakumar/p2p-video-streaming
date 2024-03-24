import React, { useState, useEffect, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import SocketContext from "./components/SocketProvider";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";
import HomePage from "./screens/HomePageScreen";
import RegisterPage from "./screens/RegisterPageScreen";
import LoginPage from "./screens/LoginPageScreen";
import AuthService from "./services/AuthService";

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
  const [openLoginSuccess, setLoginSuccess] = useState(false);
  const [openUploadError, setUploadError] = useState(false);
  const [openRoomDeleted, setOpenRoomDeleted] = useState(false);
  const [switchAuthPage, setSwitchAuthPage] = useState(false);

  const isUserLoggedIn = () => {
    return username !== "";
  };

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

  const handleLoginSuccess = () => {
    setLoginSuccess(true);
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
    AuthService.register(username, password, confirmPassword)
      .then((response) => {
        console.log(response.data);
        if (response.data === "User registered successfully") {
          setUsername(username);
        }
      })
      .catch((error) => {
        setOpenError(true);
      });
  };

  const handleLogin = (username, password) => {
    AuthService.login(username, password)
      .then((response) => {
        if (response.data === "User logged in successfully") {
          setUsername(username);
        }
      })
      .catch((error) => {
        setOpenError(true);
      });
  };

  const userLoggedIn = () => {
    if (room) {
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
      return <HomePage onFormSubmit={handleFormSubmit} username={username} />;
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
        open={openLoginSuccess}
        autoHideDuration={1000}
        onClose={handleLoginSuccess}
      >
        <Alert
          onClose={handleLoginSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Login successful
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
      {isUserLoggedIn() ? userLoggedIn() : userLoggedOut()}
    </div>
  );
}

export default App;
