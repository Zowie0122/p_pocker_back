const {
  sessionIdGenerator,
  sessionIDDuplicated,
  formatVotes,
  isOKtoShowVotes,
  resetPlayersVotes,
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

  // for master to start a session
  socket.on("getNewSessionId", ({}, callback) => {
    const sessionID = sessionIdGenerator(Object.keys(onGoingSessions));
    //keep track of the issued sessionID
    onGoingSessions[sessionID] = {
      status: "Vote in progress",
      okToShowVotes: false,
      votesInfo: {},
    };
    callback({ id: sessionID });
  });

  // check if a player's session id is available
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

    let votesInfo;

    if (onGoingSessions[id].status === "Vote in progress") {
      votesInfo = formatVotes(onGoingSessions[id].votesInfo);
    }
    if (onGoingSessions[id].status === "Vote complete") {
      votesInfo = onGoingSessions[id].votesInfo;
    }
    socket.broadcast.emit("updatedSession", {
      updatedVotesInfo: votesInfo,
      sessionStatus: onGoingSessions[id].status,
      // to inform the master if there is more than one player voted
      okToShowVotes: onGoingSessions[id].okToShowVotes,
    });

    callback({
      sessionStatus: onGoingSessions[id].status,
      cardDeck: cards,
    });
  });

  socket.on("vote", ({ id, name, card }) => {
    onGoingSessions[id].votesInfo = {
      ...onGoingSessions[id].votesInfo,
      [name]: card,
    };

    // check if there is more than one player voted
    onGoingSessions[id].okToShowVotes = isOKtoShowVotes(
      onGoingSessions[id].votesInfo
    );

    console.log("When player voted", onGoingSessions[id]);

    socket.broadcast.emit("updatedSession", {
      updatedVotesInfo: formatVotes(onGoingSessions[id].votesInfo),
      sessionStatus: onGoingSessions[id].status,
      // to inform the master if there is more than one player voted
      okToShowVotes: onGoingSessions[id].okToShowVotes,
    });
  });

  socket.on("showVotes", ({ id }) => {
    onGoingSessions[id].status = "Vote complete";
    socket.broadcast.emit("updatedSession", {
      updatedVotesInfo: onGoingSessions[id].votesInfo,
      sessionStatus: onGoingSessions[id].status,
      okToShowVotes: onGoingSessions[id].okToShowVotes,
    });
  });

  socket.on("resetVotes", ({ id }) => {
    onGoingSessions[id].status = "Vote in progress";
    onGoingSessions[id].okToShowVotes = false;
    onGoingSessions[id].votesInfo = resetPlayersVotes(
      onGoingSessions[id].votesInfo
    );
    console.log("reseted session info", onGoingSessions[id]);

    socket.broadcast.emit("updatedSession", {
      updatedVotesInfo: formatVotes(onGoingSessions[id].votesInfo),
      sessionStatus: onGoingSessions[id].status,
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
