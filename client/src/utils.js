// front-end utility functions

//check if a session id is valid with format of lowercase ***-****-***
export function isValidID(id) {
  const id_array = id.split("-");
  return (
    id_array.length === 3 &&
    id_array[0].length === 3 &&
    id_array[1].length === 4 &&
    id_array[2].length === 3 &&
    !/[^a-z]/.test(id_array[0]) &&
    !/[^a-z]/.test(id_array[1]) &&
    !/[^a-z]/.test(id_array[2])
  );
}

// check if a nickname is only with latin letters
export function isValidName(name) {
  return !/[^a-zA-Z]/.test(name);
}

// switch the current user the top of the list
export function getCurrentPlayerToTop(uid, votesInfoObject) {
  const result = [];
  for (const player in votesInfoObject) {
    if (player === uid && votesInfoObject[player].name !== "00000") {
      votesInfoObject[player].name = "*" + votesInfoObject[player].name;
      result.unshift(votesInfoObject[player]);
    } else if (player !== uid && votesInfoObject[player].name !== "00000") {
      result.push(votesInfoObject[player]);
    }
  }
  return result;
}

// remove master by master uid
export function removeMaster(uid, votesInfoObject) {
  delete votesInfoObject[uid];
  return Object.keys(votesInfoObject).map((key) => votesInfoObject[key]);
}
