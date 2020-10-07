const {
  sessionIdGenerator,
  sessionIDDuplicated,
  formatVotes,
  isOKtoShowVotes,
  resetSession,
  getRandomColor,
  removeUser,
  getLeaveUserSessionID,
} = require("./utils");
const cards = require("./cardDeck");
const express = require("express");
const cors = require("cors");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

//to store the sessions data
const onGoingSessions = {};

// for master to get a session id to start a session
app.get("/", async (req, res) => {
  try {
    // generate a new session id
    const sessionID = sessionIdGenerator(Object.keys(onGoingSessions));
    // add to sessions collection and get initial set-up
    onGoingSessions[sessionID] = {
      status: "Vote in progress",
      okToShowVotes: false,
      votesInfo: {},
    };
    res.status(200).json({ sessionID: sessionID });
  } catch (err) {
    res.status(400).json({ message: "Server Error" });
  }
});

// check if a player inputs a valid session id
app.post("/", async (req, res) => {
  try {
    const { sessionID } = req.body;
    const isExisting = sessionIDDuplicated(
      Object.keys(onGoingSessions),
      sessionID
    );
    res.status(200).json({ isExisting: isExisting });
  } catch (error) {
    res.status(400).json({ message: "Server Error" });
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connection started`);
  // when players join a session
  socket.on("join", ({ sessionID, name }, callback) => {
    if (!onGoingSessions[sessionID]) {
      callback({ error: "Valid session id accessing server" });
    } else {
      // set/add initial player info
      onGoingSessions[sessionID].votesInfo = {
        ...onGoingSessions[sessionID].votesInfo,
        [socket.id.toString()]: {
          status: "no vote",
          name: name,
          colorCode: getRandomColor(),
        },
      };

      socket.join(sessionID);
      const formattedVotes = formatVotes({ ...onGoingSessions[sessionID] });

      io.in(sessionID).emit("updatedSession", {
        sessionObject: formattedVotes,
      });

      callback({
        sessionObject: formattedVotes,
        cardDeck: cards,
        uid: socket.id,
      });
    }
  });

  socket.on("vote", ({ sessionID, uid, card }) => {
    onGoingSessions[sessionID].votesInfo[uid] = {
      ...onGoingSessions[sessionID].votesInfo[uid],
      status: card,
    };

    // check if there is more than one player voted and update (for master)
    onGoingSessions[sessionID].okToShowVotes = isOKtoShowVotes(
      onGoingSessions[sessionID].votesInfo
    );

    const formattedVotes = formatVotes({ ...onGoingSessions[sessionID] });
    io.in(sessionID).emit("updatedSession", {
      sessionObject: formattedVotes,
    });
  });

  socket.on("showVotes", ({ sessionID }) => {
    onGoingSessions[sessionID].status = "Vote complete";
    const formattedVotes = formatVotes({ ...onGoingSessions[sessionID] });
    io.in(sessionID).emit("updatedSession", {
      sessionObject: formattedVotes,
    });
  });

  socket.on("resetVotes", ({ sessionID }) => {
    onGoingSessions[sessionID] = resetSession(onGoingSessions[sessionID]);
    const formattedVotes = formatVotes({ ...onGoingSessions[sessionID] });
    io.in(sessionID).emit("updatedSession", {
      sessionObject: formattedVotes,
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} leaves connection`);
    const sessionID = getLeaveUserSessionID(socket.id, onGoingSessions);

    if (onGoingSessions[sessionID]) {
      // remove user when left
      // check if the user is master of the session
      const isMaster =
        onGoingSessions[sessionID].votesInfo[socket.id].name === "00000";
      removeUser(socket.id, sessionID, onGoingSessions);
      const formattedVotes = formatVotes(onGoingSessions[sessionID]);
      // update the other players in the session
      io.in(sessionID).emit("updatedSession", {
        sessionObject: formattedVotes,
        isMaster,
      });
    }
  });
});

// for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

http.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
