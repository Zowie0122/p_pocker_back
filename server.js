const { sessionIdGenerator, sessionIDDuplicated } = require("./utils");
const cards = require("./cardDeck");

const express = require("express");
const socketio = require("socket.io");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const onGoingSessions = {};

io.on("connection", (socket) => {
  console.log("A new connection started");
  socket.on("getNewSessionId", ({}, callback) => {
    const sessionID = sessionIdGenerator(Object.keys(onGoingSessions));
    //keep track of the issued sessionID
    onGoingSessions[sessionID] = null;
    callback({ id: sessionID });
  });

  socket.on("checkSessionID", ({ id }, callback) => {
    callback({
      existed: sessionIDDuplicated(Object.keys(onGoingSessions), id),
    });
  });

  socket.on("playerJoin", ({ id, name }, callback) => {
    onGoingSessions[id] = { ...onGoingSessions[id], [name]: "waiting" };
    const result = { ...onGoingSessions[id] };
    for (const player in result) {
      if (result[player] !== "waiting") {
        result[player] === "voted";
      }
    }
    callback({ sessionStatus: result, cardDeck: cards });
  });

  socket.on("vote", ({ id, name, card }, callback) => {
    onGoingSessions[id] = { ...onGoingSessions[id], [name]: card };
    console.log(onGoingSessions[id]);
  });

  socket.on("disconnect", () => {
    console.log("A user has left");
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

http.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
