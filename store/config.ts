const configsData = require("../config/configs.json");
import { mutationTree } from "typed-vuex";

export const state = () => ({
  data: {
    data: configsData,
  },
});

export type ConfigState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_CONFIG(state, data) {
    state.data = data;
  },
});
