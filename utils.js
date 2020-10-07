// back-end utility functions

// Session ID should be a random string of lowercase Latin alphabet letters (a-z) separated into three groups of 3, 4 and 3 characters, respectively, e.g. abc-defg-hjk
// (same as Google Hangouts video call IDs). Session ID should be generated on the backend side. Backend must keep track of all active session IDs and ensure their
// uniqueness.
function sessionIdGenerator(sessionID_array) {
  const characters = "abcdefghijklmnopqrstuvwxyz";

  function randomlettersGenerator(number) {
    let randomLetter = "";
    for (let i = 0; i < number; i++) {
      randomLetter += characters[Math.floor(Math.random() * characters.length)];
    }
    return randomLetter;
  }

  const id = `${randomlettersGenerator(3)}-${randomlettersGenerator(
    4
  )}-${randomlettersGenerator(3)}`;

  const duplicated = sessionIDDuplicated(sessionID_array, id);
  if (!duplicated) {
    return id;
  }
  return sessionIdGenerator(sessionID_array);
}

// check if a sessionID is in used
function sessionIDDuplicated(sessionID_array, sessionID) {
  return sessionID_array.includes(sessionID);
}

// reveal / hide votes result when send back to client
function formatVotes(object) {
  const copy = JSON.parse(JSON.stringify(object.votesInfo));
  if (object.status === "Vote complete") {
    return object;
  }
  for (const player in copy) {
    if (copy[player].status === "no vote") {
      copy[player].status = "waiting";
    } else {
      copy[player].status = "voted";
    }
  }
  return { ...object, votesInfo: copy };
}

function isOKtoShowVotes(voteInfoObject) {
  for (const player in voteInfoObject) {
    if (voteInfoObject[player].status !== "no vote") {
      return true;
    }
  }
  return false;
}

function resetSession(session) {
  session.status = "Vote in progress";
  session.okToShowVotes = false;

  for (const player in session.votesInfo) {
    if (session.votesInfo[player].status !== "no vote") {
      session.votesInfo[player].status = "no vote";
    }
  }
  return session;
}

function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getLeaveUserSessionID(uid, sessionsInfoObject) {
  for (const session in sessionsInfoObject) {
    for (const player in sessionsInfoObject[session].votesInfo) {
      if (player === uid) {
        return session;
      }
    }
  }
}

function removeUser(uid, sessionID, sessionsInfoObject) {
  for (const player in sessionsInfoObject[sessionID].votesInfo) {
    if (player === uid) {
      delete sessionsInfoObject[sessionID].votesInfo[uid];
      return;
    }
  }
}

module.exports = {
  sessionIdGenerator: sessionIdGenerator,
  sessionIDDuplicated: sessionIDDuplicated,
  formatVotes: formatVotes,
  isOKtoShowVotes: isOKtoShowVotes,
  resetSession: resetSession,
  getRandomColor: getRandomColor,
  removeUser: removeUser,
  getLeaveUserSessionID: getLeaveUserSessionID,
};
