require("dotenv").config();

const express = require("express");
const http = require("http");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { encryptFile, decryptFile } = require("./utils/encrypt/encryption");

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
const { Blockchain, Block } = require("./utils/crypto/Blockchain");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

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

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

const myBlockChain = new Blockchain();

const upload = multer({ storage: storage });

const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/upload", upload.single("video"), async (req, res) => {
  const { room, isPrivate, title, description } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const uploadedFilePath = req.file.path;
  console.log(uploadedFilePath);
  const encryptedFilePath = path.join("uploads", `encrypted_${room}`);

  try {
    await encryptFile(uploadedFilePath, encryptedFilePath);
    fs.unlinkSync(uploadedFilePath); // Optionally delete the original file
    changeRoomDetails(room, isPrivate, title, description);
    res.send("File uploaded and encrypted successfully.");
  } catch (error) {
    console.error("Error during file encryption:", error);
    res.status(500).send("Error encrypting file.");
  }
});

app.get("/video/:filename", (req, res) => {
  const { filename } = req.params;
  const encryptedFilePath = path.join(
    __dirname,
    "uploads",
    `encrypted_${filename}`
  );
  const decryptedFilePath = path.join(
    __dirname,
    "uploads",
    `decrypted_${filename}`
  );

  decryptFile(encryptedFilePath, decryptedFilePath)
    .then(() => {
      res.sendFile(decryptedFilePath, (err) => {
        if (err) {
          console.log(err);
          res.status(404).send("Sorry, can't find that file!");
        }
        // Optionally delete the decrypted file after sending it to the client
        fs.unlinkSync(decryptedFilePath);
      });
    })
    .catch((error) => {
      console.error("Error during file decryption:", error);
      res.status(500).send("Error decrypting file.");
    });
});

app.get("/download/video/:filename", (req, res) => {
  const { filename } = req.params;
  const encryptedFilePath = path.join(
    __dirname,
    "uploads",
    `encrypted_${filename}`
  );

  const decryptedFilePath = path.join(
    __dirname,
    "uploads",
    `decrypted_${filename}.mp4`
  );

  decryptFile(encryptedFilePath, decryptedFilePath)
    .then(() => {
      res.download(decryptedFilePath, (err) => {
        if (err) {
          console.log(err);
          res.status(404).send("Sorry, can't find that file!");
        }
        // Optionally delete the decrypted file after sending it to the client
        fs.unlinkSync(decryptedFilePath);
      });
    })
    .catch((error) => {
      console.error("Error during file decryption:", error);
      res.status(500).send("Error decrypting file.");
    });
});

app.get("/rooms", (req, res) => {
  res.send(getAllRooms("false"));
});

app.get("/users", (req, res) => {
  res.send(getAllUsers());
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering new user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    res.status(200).send("User logged in successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    myBlockChain.addBlock({ username, room });
    console.log("Blockchain is valid: " + myBlockChain.isChainValid());

    if (error) {
      return callback(error);
    }

    if (!getRoom(room)) {
      addRoom(room, username);
    }

    socket.join(room);
    console.log(`User ${username} joined room: ${room}`);
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

  socket.on("disconnect", () => {});

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
