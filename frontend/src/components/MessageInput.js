import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Type a message..."
      value={message}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="send">
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default MessageInput;
