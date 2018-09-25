/* eslint-disable */
const str = window.localStorage;

const state = {
  fontSize: str.getItem("fontSize") || 14,
  bgIndex: str.getItem("bgIndex") || 1,
  direction: str.getItem("direction") || "vertical",
  night: str.getItem("night") || false
};

export default state;
