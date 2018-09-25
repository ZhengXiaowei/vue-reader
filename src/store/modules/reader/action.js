/* eslint-disable */
import * as type from "./mutation-type";
const str = window.localStorage;

// 修改阅读器的设置
export const setReaderOptions = ({ commit, getters }, { name, value }) => {
  switch (name) {
    case "font":
      commit(type.SET_FONTSIZE, value);
      str.setItem("fontSize", value);
      break;
    case "bg":
      commit(type.SET_BG_INDEX, value);
      str.setItem("bgIndex", value);
      break;
    case "direction":
      commit(type.SET_READER_DIRECTION, value);
      str.setItem("direction", value);
      break;
    case "night":
      commit(type.TOGGLE_READER_NIGHT);
      str.setItem("night", getters.night);
      break;
    default:
      return;
  }
};
