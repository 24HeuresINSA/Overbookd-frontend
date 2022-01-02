// assignment store

import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import timeslotRepo from "~/repositories/timeslotRepo";
import { User } from "~/utils/models/repo";
import { Timeslot } from "~/utils/models/timeframe";

interface mState {
  user: User | null;
  timeslots: Timeslot[];
}

export const state = function (): mState {
  return {
    user: null,
    timeslots: [],
  };
};

export const getters = getterTree(state, {
  availabilities: function (state): Timeslot[] {
    if (state.user) {
      return state.timeslots.filter((t) => {
        if (state.user) {
          return state.user.availabilities.includes(t._id);
        }
      });
    }
    return [];
  },
});

export type AssignmentState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TIMESLOTS: (state, timeslots) => {
    state.timeslots = timeslots;
  },
});

export const actions = actionTree(
  { state },
  {
    async setUser({ commit }, user) {
      commit("SET_USER", user);
    },
    async fetchTimeslots({ commit }) {
      const res = await safeCall(this, timeslotRepo.getAll(this));
      if (res) {
        commit("SET_TIMESLOTS", res.data);
      }
    },
  }
);
