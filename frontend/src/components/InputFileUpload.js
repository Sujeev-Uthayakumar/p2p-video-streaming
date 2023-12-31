import React, { useState, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import SocketContext from "./SocketProvider";

function InputFileUpload({
  room,
  isOwner,
  handleUploadError,
  handleUploadSuccess,
}) {
  const socket = useContext(SocketContext);

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(null);
  const [error, setError] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setError(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleChange = (event) => {
    setIsPrivate(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(true);
      return;
    }

    const newFileName = `${room}.${selectedFile.type.split("/")[1]}`;
    const formData = new FormData();
    formData.append("video", selectedFile, newFileName);
    formData.append("title", videoTitle);
    formData.append("description", description);
    formData.append("room", room);
    formData.append("isPrivate", isPrivate);

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
        socket.emit("uploadVideo", { room, videoTitle: newFileName });
        handleUploadSuccess();
      } else {
        handleUploadError();
      }
    } catch (error) {
      handleUploadError();
    }
    setOpen(false);
  };

  return (
    <div>
      <Box sx={{ position: "absolute", bottom: 36, right: 36 }}>
        <Fab
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Video</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To upload a video to stream to others, please enter the title and
            description here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Video Title"
            fullWidth
            variant="standard"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            error={videoTitle === ""}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={description === ""}
          />
          <FormControl
            sx={{ marginTop: 1, minWidth: 120 }}
            error={isPrivate === null}
          >
            <InputLabel id="demo-simple-select-label">Privacy</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={isPrivate}
              label="Privacy"
              onChange={handleChange}
            >
              <MenuItem value={true}>Private</MenuItem>
              <MenuItem value={false}>Public</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ marginTop: "20px" }}>
            <input type="file" accept="video/*" onChange={handleFileChange} />
          </Box>
          <DialogContentText sx={{ marginTop: "5px" }} color="error">
            {error ? "Please add a video to upload" : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleUpload()}>Upload</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InputFileUpload;
