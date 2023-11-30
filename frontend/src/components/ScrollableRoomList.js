// ScrollableRoomList.js
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import TvIcon from "@mui/icons-material/Tv";

const ScrollableRoomList = ({ rooms }) => {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 480,
        bgcolor: "background.paper",
        borderRadius: 2,
        overflowY: "auto",
        maxHeight: 300,
        my: 2,
      }}
    >
      {rooms.map((room, index) => (
        <React.Fragment key={room.id}>
          {index > 0 && <Divider variant="inset" component="li" />}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <TvIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={room.name} secondary={`ID: ${room.id}`} />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
};

export default ScrollableRoomList;
