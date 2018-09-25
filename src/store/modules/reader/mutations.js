/* eslint-disable */
import * as type from "./mutation-type";

const mutation = {
  [type.SET_FONTSIZE](state, fontsize) {
    state.fontSize = fontsize;
  },
  [type.SET_BG_INDEX](state, index) {
    state.bgIndex = index;
  },
  [type.SET_READER_DIRECTION](state, dir) {
    state.direction = dir;
  },
  [type.TOGGLE_READER_NIGHT](state) {
    if (typeof state.night === 'string') state.night = state.night === 'true' ? false : true
    else state.night = !state.night;
  }
};

export default mutation;
