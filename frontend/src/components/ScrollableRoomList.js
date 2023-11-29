// ScrollableRoomList.js
import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';

const ScrollableRoomList = ({ rooms }) => {
  return (
    <List sx={{
      width: '100%', 
      maxWidth: 480, // Adjust the width as needed
      bgcolor: 'background.paper',
      borderRadius: 2,
      overflowY: 'auto',
      maxHeight: 300, // Adjust the fixed height as needed
      my: 2
    }}>
      {rooms.map((room, index) => (
        <React.Fragment key={room.id}>
          {index > 0 && <Divider variant="inset" component="li" />}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <RoomIcon />
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
