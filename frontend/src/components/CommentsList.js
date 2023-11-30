import React, { Fragment, useState, useContext, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import MessageInput from "./MessageInput";
import SocketContext from "./SocketProvider";

const CommentsList = ({ username, room }) => {
  const socket = useContext(SocketContext);

  const [commentsList, setCommentsList] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("comment", ({ username, message }) => {
      console.log(username, message);
      setCommentsList((prevComments) => [
        ...prevComments,
        { username, message },
      ]);
    });

    return () => {
      socket.off("comment");
    };
  }, []);

  const onSendMessage = (message) => {
    setMessage(message);
    sendMessage(username, message, room);
  };

  const sendMessage = (username, message, room) => {
    socket.emit("sendComment", { username, message, room });
  };
  console.log(commentsList);

  return (
    <div>
      <List
        sx={{
          minHeight: "85vh",
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          overflowY: "auto",
          maxHeight: "85vh",
        }}
      >
        {commentsList.map(({ username, message }) => {
          return (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={username} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  secondary={
                    <Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {username}
                      </Typography>
                      {` — ${message}`}
                    </Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default CommentsList;
