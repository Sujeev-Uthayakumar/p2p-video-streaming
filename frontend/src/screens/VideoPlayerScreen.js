import React, { useEffect, useContext, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Fab from "@mui/material/Fab";
import DownloadIcon from "@mui/icons-material/Download";
import InputFileUpload from "../components/InputFileUpload";
import SocketContext from "../components/SocketProvider";
import Header from "../components/Header";
import CommentsList from "../components/CommentsList";

const VideoPlayerScreen = ({
  room,
  username,
  resetUser,
  handleUploadError,
  handleUploadSuccess,
}) => {
  const socket = useContext(SocketContext);

  const [videoUrl, setVideoUrl] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  useEffect(() => {
    socket.on("userJoined", ({ needVideo, roomData }) => {
      console.log(needVideo);
      const { video, owner, title, description } = roomData;
      if (video) {
        console.log(video);
        setVideoTitle(title);
        setVideoDescription(description);
        getVideo(video);
      }
      if (owner === username) {
        setIsOwner(true);
      }
    });

    socket.on("videoUploaded", (roomData) => {
      const { video, title, description } = roomData;
      setVideoTitle(title);
      setVideoDescription(description);
      getVideo(video);
    });

    return () => {
      socket.off("videoUploaded");
      socket.off("userJoined");
    };
  }, []);

  const getVideo = async (videoTitle) => {
    const response = await axios.get(
      `http://localhost:3001/video/${videoTitle}`,
      { responseType: "blob" }
    );
    setVideoUrl(URL.createObjectURL(response.data));
  };

  const downloadVideo = async () => {
    await axios.post(`http://localhost:3001/download/video/${videoTitle}`, {
      responseType: "blob",
    });
  };

  return (
    <div>
      <Header
        resetUser={resetUser}
        room={room}
        username={username}
        isOwner={isOwner}
      />
      {videoUrl ? (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <CommentsList username={username} room={room} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "100px",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "center", padding: "0" }}
            >
              <ReactPlayer url={videoUrl} controls={true} />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6">{videoTitle}</Typography>
              <Typography>{videoDescription}</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "75vh",
          }}
        >
          <CircularProgress />
          <Box sx={{ padding: "20px" }}>Waiting for video...</Box>
        </Box>
      )}

      {isOwner ? (
        <InputFileUpload
          handleUploadError={handleUploadError}
          handleUploadSuccess={handleUploadSuccess}
          room={room}
        />
      ) : null}
      {videoUrl ? (
        <Box>
          <a
            href={`http://localhost:3001/download/video/${videoTitle}`}
            download={"test.mp4"}
          >
            <Fab
              size="medium"
              sx={{ position: "absolute", bottom: 105, right: 36 }}
            >
              <DownloadIcon />
            </Fab>
          </a>
        </Box>
      ) : null}
    </div>
  );
};

export default VideoPlayerScreen;
