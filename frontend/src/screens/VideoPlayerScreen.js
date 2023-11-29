import React, { useEffect, useContext, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import InputFileUpload from "../components/InputFileUpload";
import SocketContext from "../components/SocketProvider";
import Header from "../components/Header";
import CommentsList from "../components/CommentsList";

const VideoPlayerScreen = ({ room, username, resetUser }) => {
  const socket = useContext(SocketContext);

  const [videoUrl, setVideoUrl] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    socket.on("userJoined", ({ needVideo, roomData }) => {
      console.log(needVideo);
      const { video, owner } = roomData;
      if (video) {
        console.log(video);
        getVideo(video);
      }
      if (owner === username) {
        setIsOwner(true);
      }
    });

    socket.on("videoUploaded", (roomData) => {
      const { video } = roomData;
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
          <CommentsList />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "100px",
              flexGrow: 1,
            }}
          >
            <ReactPlayer
              height={396}
              width={704}
              url={videoUrl}
              controls={true}
            />
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

      {isOwner ? <InputFileUpload room={room} /> : null}
    </div>
  );
};

export default VideoPlayerScreen;
