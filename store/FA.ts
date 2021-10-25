import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { FA } from "~/utils/models/FA";

export const state = () => ({
  mFA: {
    equipments: [] as any,
    timeframes: [] as any,
  } as FA,
});

export const getters = getterTree(state, {
  getEquipments: function (state) {
    return state.mFA.equipments;
  },
});

export const mutations = mutationTree(state, {
  ASSIGN_FA: function (state, data) {
    Object.keys(data).forEach((key: string) => {
      // @ts-ignore
      if (state.mFA[key]) {
        // @ts-ignore
        Object.assign(state.mFA[key], data[key]);
      }
    });
  },
  SET_FA: function (state, mFA) {
    state.mFA = mFA;
  },
  ADD_TIMEFRAME: function (state, timeframe) {
    state.mFA.timeframes.push(timeframe);
  },
  ADD_EQUIPMENT: function (state, equipment) {
    state.mFA.equipments.push(equipment);
  },
  DELETE_TIMEFRAME: function (state, index) {
    state.mFA.timeframes.splice(index, 1);
  },
  UPDATE_REQUIRED_EQUIPMENT: function (state, { _id, count }) {
    const equipment = state.mFA.equipments.find((e: any) => e._id === _id);
    if (equipment) {
      equipment.required = count;
    }
  },
  DELETE_EQUIPMENT: function (state, _id) {
    // @ts-ignore
    state.mFA.equipments = state.mFA.equipments.filter(
      (e: any) => e._id !== _id
    );
    console.log(state.mFA);
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
    addEquipmentToFA: function ({ commit, state }, payload) {
      if (!state.mFA.equipments.find((e: any) => payload._id === e._id)) {
        payload.required = 1;
        commit("ADD_EQUIPMENT", payload);
      }
    },
    deleteTimeframe: function ({ commit }, payload) {
      commit("DELETE_TIMEFRAME", payload);
    },
    updateEquipmentRequiredCount: function ({ commit }, payload) {
      commit("UPDATE_REQUIRED_EQUIPMENT", payload);
    },
    deleteEquipment: function ({ commit }, payload) {
      commit("DELETE_EQUIPMENT", payload);
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
