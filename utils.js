// Session ID should be a random string of lowercase Latin alphabet letters (a-z) separated into three groups of 3, 4 and 3 characters, respectively, e.g. abc-defg-hjk
// (same as Google Hangouts video call IDs). Session ID should be generated on the backend side. Backend must keep track of all active session IDs and ensure their
// uniqueness.

const sessionIdGenerator = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz";

  const randomlettersGenerator = (number) => {
    let randomLetter = "";
    for (let i = 0; i < number; i++) {
      randomLetter += characters[Math.floor(Math.random() * characters.length)];
    }
    return randomLetter;
  };

  return `${randomlettersGenerator(3)}-${randomlettersGenerator(
    4
  )}-${randomlettersGenerator(3)}`;
};
