import React, { useEffect, useContext } from "react";

import InputFileUpload from "../components/InputFileUpload";
import SocketContext from "../components/SocketProvider";

const VideoPlayerScreen = ({ room }) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("sendVideo", (msg) => {
      alert(msg);
    });

    socket.on("requestVideo", (videoTitle) => {
      alert(videoTitle);
    });

    return () => {
      socket.off("videoUpload");
      socket.off("videoSent");
    };
  }, []);

  return (
    <div>
      <InputFileUpload room={room} />
    </div>
  );
};

export default VideoPlayerScreen;
