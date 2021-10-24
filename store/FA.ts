import { actionTree, mutationTree } from "typed-vuex";

export const state = () => ({
  mFA: {
    timeframes: [],
  },
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
    state.mFA = {
      timeframes: [],
    };
  },
  ADD_TIMEFRAME: function (state, timeframe) {
    // @ts-ignore
    state.mFA.timeframes.push(timeframe);
  },
});

export const actions = actionTree(
  { state },
  {
    assignFA: function ({ commit }, payload) {
      commit("ASSIGN_FA", payload);
    },
    addTimeframeToFA: function ({ commit }, payload) {
      commit("ADD_TIMEFRAME", payload);
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
