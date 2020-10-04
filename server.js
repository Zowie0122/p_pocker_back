const {
  sessionIdGenerator,
  sessionIDDuplicated,
  formatVotes,
  isOKtoShowVotes,
} = require("./utils");
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
  console.log(onGoingSessions);
  socket.on("getNewSessionId", ({}, callback) => {
    const sessionID = sessionIdGenerator(Object.keys(onGoingSessions));
    //keep track of the issued sessionID
    onGoingSessions[sessionID] = {
      status: "Vote in progress",
      okToShowVotes: false,
      votesInfo: {},
    };
    console.log(onGoingSessions);
    callback({ id: sessionID });
  });

  socket.on("checkSessionID", ({ id }, callback) => {
    callback({
      existed: sessionIDDuplicated(Object.keys(onGoingSessions), id),
    });
  });

  socket.on("playerJoin", ({ id, name }, callback) => {
    onGoingSessions[id].votesInfo = {
      ...onGoingSessions[id].votesInfo,
      [name]: "no vote",
    };

    socket.broadcast.emit("updatedSession", {
      updatedVotesInfo: formatVotes(onGoingSessions[id].votesInfo),
      // to inform the master if there is more than one player voted
      okToShowVotes: onGoingSessions[id].okToShowVotes,
    });

    callback({
      votesInfo: formatVotes(onGoingSessions[id].votesInfo),
      // in case the same when a player joins and master completes the vote
      okToShowVotes: onGoingSessions[id].okToShowVotes,
      cardDeck: cards,
    });
  });

  socket.on("vote", ({ id, name, card }, callback) => {
    onGoingSessions[id].votesInfo = {
      ...onGoingSessions[id].votesInfo,
      [name]: card,
    };

    // check if there is more than one player voted
    onGoingSessions[id].okToShowVotes = isOKtoShowVotes(
      onGoingSessions[id].votesInfo
    );

    socket.broadcast.emit("updatedSession", {
      updatedVotesInfo: formatVotes(onGoingSessions[id].votesInfo),
      // to inform the master if there is more than one player voted
      okToShowVotes: onGoingSessions[id].okToShowVotes,
    });
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
