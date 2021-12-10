import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";

export const state = () => ({
  items: [] as any,
});

export const mutations = mutationTree(state, {
  SET_ALL_EQUIPMENT: function (state, items) {
    state.items = items;
  },
  SET_EQUIPMENT: function (state, item) {
    state.items.push(item);
  },
  UPDATE_EQUIPMENT: function (state, item) {
    const index = state.items.findIndex((i: any) => i._id === item._id);
    if (index !== -1) {
      state.items[index] = item;
      state.items = [...state.items];
    }
    //Force update the store
  },
  DELETE_EQUIPMENT: function (state, item) {
    state.items = state.items.filter((i: any) => i._id !== item._id);
  },
});

export const actions = actionTree(
  { state },
  {
    fetchAll: async function ({ commit, state }) {
      if (state.items.length > 0) {
        return;
      }
      const res = await safeCall(
        this,
        RepoFactory.equipmentRepo.getAllEquipments(this)
      );
      if (res) {
        commit("SET_ALL_EQUIPMENT", res.data);
      }
      return res;
    },
    set: async function ({ commit }, equipment) {
      const res = await safeCall(
        this,
        RepoFactory.equipmentRepo.setEquipment(this, equipment)
      );
      if (res && res.data) {
        commit("SET_EQUIPMENT", res.data);
      }
      return res;
    },
    delete: async function ({ commit }, equipment) {
      equipment.isValid = false;
      const res = await safeCall(
        this,
        RepoFactory.equipmentRepo.setEquipment(this, equipment)
      );
      if (res && res.data) {
        commit("DELETE_EQUIPMENT", res.data);
      }
      return res;
    },
    update: async function ({ commit }, equipment) {
      const res = await safeCall(
        this,
        RepoFactory.equipmentRepo.setEquipment(this, equipment)
      );
      if (res && res.data) {
        commit("UPDATE_EQUIPMENT", res.data);
      }
      return res;
    },
  }
);
