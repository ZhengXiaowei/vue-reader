/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import reader from "./modules/reader";

import createLogger from "vuex/dist/logger";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    reader
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
