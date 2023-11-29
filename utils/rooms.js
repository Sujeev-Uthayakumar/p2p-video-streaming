const rooms = [];

const addRoom = (id, owner) => {
  const room = { id, owner, video: null };
  rooms.push(room);
};

const removeRoom = (id) => {
  const index = rooms.findIndex((room) => {
    return room.id === id;
  });

  if (index !== -1) {
    return rooms.splice(index, 1)[0];
  }
};

const getRoom = (id) => {
  return rooms.find((room) => room.id === id);
};

const addVideoToRoom = (id, video) => {
  const room = getRoom(id);
  room.video = video;
};

module.exports = {
  addRoom,
  removeRoom,
  getRoom,
  addVideoToRoom,
};
