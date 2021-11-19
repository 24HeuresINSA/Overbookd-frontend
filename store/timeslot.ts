import { mutationTree, actionTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { timeslot } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const timeslotRepo = RepoFactory.timeslotRepo;

export const state = () => ({
  timeslots: [] as timeslot[],
  createStatus: "",
});

export const mutations = mutationTree(state, {
  SET_TIMESLOTS(state, timeslots: timeslot[]) {
    state.timeslots = timeslots;
  },

  ADD_TIMESLOT(state, timeslot: timeslot) {
    state.timeslots.push(timeslot);
  },

  ADD_TIMESLOTS(state, timeslots: timeslot[]) {
    state.timeslots.push(...timeslots);
  },

  SET_CREATE_STATUS(state, status: string) {
    state.createStatus = status;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchTimeslots(context) {
      const res = await safeCall(this, timeslotRepo.getAll(this));
      if (res && res.data) {
        context.commit("SET_TIMESLOTS", res.data);
      }
    },
    async addTimeslot(context, timeslot: timeslot) {
      const newTimeslotRes = await safeCall(
        this,
        timeslotRepo.create(this, timeslot)
      );
      if (newTimeslotRes && newTimeslotRes.data) {
        context.commit("ADD_TIMESLOT", newTimeslotRes.data);
      }
    },
    async addTimeslots(context, timeslots: timeslot[]) {
      const res = await safeCall(
        this,
        timeslotRepo.createMany(this, timeslots)
      );
      if (res && res.data) {
        context.commit("ADD_TIMESLOTS", res.data);
        context.commit("SET_CREATE_STATUS", "Done !");
      } else {
        context.commit(
          "SET_CREATE_STATUS",
          "Un ou plusieurs créneaux existent déjà 😒"
        );
      }
    },
    async setCreateStatus(context, status: string) {
      context.commit("SET_CREATE_STATUS", status);
    },
  }
);
