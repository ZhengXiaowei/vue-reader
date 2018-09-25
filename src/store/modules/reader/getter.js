/* eslint-disable */
// 获取字体大小
export const fontSize = state => parseInt(state.fontSize);

// 获取背景索引
export const bgIndex = state => parseInt(state.bgIndex);

// 获取是否夜间模式
export const night = state => {
  if (typeof state.night === "string") {
    return state.night === "true";
  }
  return state.night;
};
