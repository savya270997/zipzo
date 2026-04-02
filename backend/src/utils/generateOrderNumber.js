const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

const randomDigitBlock = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

const randomLetterBlock = (length) =>
  Array.from({ length }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]).join("");

export const generateOrderNumber = () => `${randomLetterBlock(4)}${randomDigitBlock(8)}`;
