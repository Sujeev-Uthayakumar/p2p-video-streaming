const rooms = [];

const addRoom = (id, owner) => {
  const room = {
    id,
    owner,
    video: null,
    isPrivate: null,
    title: null,
    description: null,
  };
  rooms.push(room);
};

const getAllRooms = (isPrivate) => {
  const result = rooms.filter((room) => room.isPrivate === isPrivate);
  if (result) {
    return result;
  } else {
    return [];
  }
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

const changeRoomDetails = (id, isPrivate, title, description) => {
  const room = getRoom(id);
  room.isPrivate = isPrivate;
  room.title = title;
  room.description = description;
};

module.exports = {
  addRoom,
  getAllRooms,
  removeRoom,
  getRoom,
  addVideoToRoom,
  changeRoomDetails,
};
