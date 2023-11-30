const express = require("express");
const http = require("http");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const {
  addUser,
  removeUser,
  removeUsersInRoom,
  getUsersInRoom,
  getAllUsers,
} = require("./utils/users");
const {
  addRoom,
  getAllRooms,
  removeRoom,
  getRoom,
  addVideoToRoom,
  changeRoomDetails,
} = require("./utils/rooms");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/upload", upload.single("video"), (req, res) => {
  const { room, isPrivate, title, description } = req.body;
  console.log(req);
  console.log(getRoom("test"));
  changeRoomDetails(room, isPrivate, title, description);
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  return res.status(200).send("File uploaded successfully.");
});

app.get("/video/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send("Sorry, can't find that file!");
    }
  });
});

app.get("/rooms", (req, res) => {
  res.send(getAllRooms("false"));
});

app.get("/users", (req, res) => {
  res.send(getAllUsers());
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    if (!getRoom(room)) {
      addRoom(room, username);
    }

    socket.join(room);
    console.log(`User ${socket.id} joined room: ${username} ${room} `);
    io.to(room).emit("userJoined", {
      needVideo: getUsersInRoom(room).length === 1 ? true : false,
      roomData: getRoom(room),
    });
  });

  socket.on("leaveRoom", ({ room, username }) => {
    const roomData = getRoom(room);
    if (roomData.owner === username) {
      removeRoom(room);
      removeUsersInRoom(room);
      socket.leave(room);
      io.to(room).emit("roomDeleted", room);
    } else {
      removeUser(username);
      socket.leave(room);
      console.log(`User ${username} left room: ${room}`);
      io.to(room).emit("userLeft", `User ${username} has left the room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("test");
  });

  socket.on("uploadVideo", ({ room, videoTitle }) => {
    addVideoToRoom(room, videoTitle);
    io.to(room).emit("videoUploaded", getRoom(room));
  });

  socket.on("sendComment", ({ username, message, room }) => {
    console.log(username, message, room);
    io.to(room).emit("comment", { username, message });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
