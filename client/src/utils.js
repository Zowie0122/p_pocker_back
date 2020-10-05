// front-end utility functions

//check if a session id is valid with format of lowercase ***-****-***
export function isValidID(id) {
  let isValid = true;
  const id_array = id.split("-");
  if (
    id_array.length !== 3 ||
    id_array[0].length !== 3 ||
    id_array[1].length !== 4 ||
    id_array[2].length !== 3
  ) {
    isValid = false;
    return isValid;
  } else if (
    /[^a-z]/.test(id_array[0]) ||
    /[^a-z]/.test(id_array[1]) ||
    /[^a-z]/.test(id_array[2])
  ) {
    isValid = false;
    return isValid;
  }

  return isValid;
}

// check if a nickname is only with latin letters
export function isValidName(name) {
  return !/[^a-zA-Z]/.test(name);
}
