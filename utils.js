function sessionIdGenerator(sessionID_array) {
  // Session ID should be a random string of lowercase Latin alphabet letters (a-z) separated into three groups of 3, 4 and 3 characters, respectively, e.g. abc-defg-hjk
  // (same as Google Hangouts video call IDs). Session ID should be generated on the backend side. Backend must keep track of all active session IDs and ensure their
  // uniqueness.
  const characters = "abcdefghijklmnopqrstuvwxyz";

  const randomlettersGenerator = (number) => {
    let randomLetter = "";
    for (let i = 0; i < number; i++) {
      randomLetter += characters[Math.floor(Math.random() * characters.length)];
    }
    return randomLetter;
  };

  const id = `${randomlettersGenerator(3)}-${randomlettersGenerator(
    4
  )}-${randomlettersGenerator(3)}`;

  const duplicated = sessionIDDuplicated(sessionID_array, id);
  if (!duplicated) {
    return id;
  }
  return sessionIdGenerator(sessionID_array);
}

function sessionIDDuplicated(sessionID_array, sessionID) {
  //check if a sessionID is in used
  return sessionID_array.includes(sessionID);
}

function formatVotes(voteInfoObject) {
  const result = { ...voteInfoObject };
  for (const player in result) {
    if (result[player] !== "no vote") {
      result[player] = "voted";
    } else {
      result[player] = "waiting";
    }
  }
  return result;
}

function isOKtoShowVotes(voteInfoObject) {
  for (const player in voteInfoObject) {
    if (voteInfoObject[player] !== "no vote") {
      return true;
    }
  }
  return false;
}

module.exports = {
  sessionIdGenerator: sessionIdGenerator,
  sessionIDDuplicated: sessionIDDuplicated,
  formatVotes: formatVotes,
  isOKtoShowVotes: isOKtoShowVotes,
};
