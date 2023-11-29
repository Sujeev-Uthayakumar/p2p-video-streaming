import React, { useEffect, useContext, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

import InputFileUpload from "../components/InputFileUpload";
import SocketContext from "../components/SocketProvider";

const VideoPlayerScreen = ({ room }) => {
  const socket = useContext(SocketContext);

  const [needVideo, setNeedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    socket.on("userJoined", ({ needVideo, roomData }) => {
      console.log(roomData);
      const { video } = roomData;
      setNeedVideo(needVideo);
      if (video) {
        console.log(video);
        getVideo(video);
      }
    });

    socket.on("videoUploaded", (roomData) => {
      const { video } = roomData;
      getVideo(video);
      alert(video);
    });

    return () => {
      socket.off("videoUploaded");
      socket.off("userJoined");
    };
  });

  const getVideo = async (videoTitle) => {
    const response = await axios.get(
      `http://localhost:3001/video/${videoTitle}`,
      { responseType: "blob" }
    );
    setVideoUrl(URL.createObjectURL(response.data));
  };

  return (
    <div>
      <ReactPlayer url={videoUrl} controls={true} />
      {needVideo ? <InputFileUpload room={room} /> : null}
    </div>
  );
};

export default VideoPlayerScreen;
