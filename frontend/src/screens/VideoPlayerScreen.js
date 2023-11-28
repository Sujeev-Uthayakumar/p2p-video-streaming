import React, { useEffect, useContext, useState } from "react";
import ReactPlayer from "react-player";

import InputFileUpload from "../components/InputFileUpload";
import SocketContext from "../components/SocketProvider";

const VideoPlayerScreen = ({ room }) => {
  const socket = useContext(SocketContext);

  const [needVideo, setNeedVideo] = useState(null);

  useEffect(() => {
    socket.on("userJoined", (needVideo) => {
      setNeedVideo(needVideo);
    });

    socket.on("videoUploaded", (videoTitle) => {
      console.log("dawdad");
      alert(videoTitle);
    });

    return () => {
      socket.off("videoUploaded");
      socket.off("userJoined");
    };
  });

  return (
    <div>
      <ReactPlayer url="https://www.youtube.com/watch?v=LXb3EKWsInQ" />
      {needVideo ? <InputFileUpload room={room} /> : null}
    </div>
  );
};

export default VideoPlayerScreen;
