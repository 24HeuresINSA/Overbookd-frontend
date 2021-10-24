import { actionTree, mutationTree } from "typed-vuex";

export const state = () => ({
  mFA: {},
});

export const mutations = mutationTree(state, {
  ASSIGN_FA: function (state, data) {
    Object.keys(data).forEach((key) => {
      // @ts-ignore
      Object.assign(state.mFA[key], data[key]);
    });
  },
  SET_FA: function (state, mFA) {
    state.mFA = mFA;
  },
  RESET_FA: function (state) {
    state.mFA = {};
  },
});

export const actions = actionTree(
  { state },
  {
    assignFA: function ({ commit }, payload) {
      commit("ASSIGN_FA", payload);
    },
    setFA: function ({ commit }, payload) {
      console.log("FA set");
      commit("SET_FA", payload);
    },
    resetFA: function ({ commit }, payload) {
      commit("SET_FA", payload);
    },
  }
);
