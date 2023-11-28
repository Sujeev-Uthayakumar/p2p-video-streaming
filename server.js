const express = require("express");
const http = require("http");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

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
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage: storage });

const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/upload", upload.single("video"), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  return res.status(200).send("File uploaded successfully.");
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("joinRoom", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(room);
    console.log(`User ${socket.id} joined room: ${username} ${room} `);
    socket.to(room).emit("userJoined", `User ${socket.id} has joined the room`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
    socket.to(room).emit("userLeft", `User ${socket.id} has left the room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
