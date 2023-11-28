import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import SocketContext from "./SocketProvider";

function InputFileUpload({ room }) {
  const socket = useContext(SocketContext);

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    socket.on("videoUploaded", (videoTitle) => {
      console.log("dawdad");
      alert(videoTitle);
    });

    return () => {
      socket.off("videoUploaded");
    };
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    const newFileName = `${room}.${selectedFile.type.split("/")[1]}`;
    const formData = new FormData();
    formData.append("video", selectedFile, newFileName);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("Video uploaded successfully");
        socket.emit("uploadVideo", { room, videoTitle: newFileName });
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Upload error");
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Video</button>
    </div>
  );
}

export default InputFileUpload;
