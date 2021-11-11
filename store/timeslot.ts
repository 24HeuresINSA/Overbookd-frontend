import { mutationTree, actionTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { timeslot } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const timeslotRepo = RepoFactory.timeslotRepo;

export const state = () => ({
  timeslots: [] as timeslot[],
  WIPtimeslots: [] as timeslot[],
  start: "" as string,
  end: "" as string,
  date: "" as string,
  groupTitle: "" as string,
  groupDescription: "" as string,
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

  ADD_WIP_TIMESLOT(state, timeslot: timeslot) {
    state.WIPtimeslots.push(timeslot);
  },

  SET_START(state, start: string) {
    state.start = start;
  },
  SET_END(state, end: string) {
    state.end = end;
  },
  SET_DATE(state, date: string) {
    state.date = date;
  },
  SET_GROUP_TITLE(state, title: string) {
    state.groupTitle = title;
  },
  SET_GROUP_DESCRIPTION(state, description: string) {
    state.groupDescription = description;
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
      const newTimeslotsRes = await safeCall(
        this,
        timeslotRepo.createMany(this, timeslots)
      );
      if (newTimeslotsRes && newTimeslotsRes.data) {
        context.commit("ADD_TIMESLOTS", newTimeslotsRes.data);
      }
    },
    async addWIPTimeslot(context, timeslot: timeslot) {
      context.commit("ADD_WIP_TIMESLOT", timeslot);
    },
    async setStart(context, start: string) {
      context.commit("SET_START", start);
    },
    async setEnd(context, end: string) {
      context.commit("SET_END", end);
    },
    async setDate(context, date: string) {
      context.commit("SET_DATE", date);
    },
    async setGroupTitle(context, title: string) {
      context.commit("SET_GROUP_TITLE", title);
    },
    async setGroupDescription(context, description: string) {
      context.commit("SET_GROUP_DESCRIPTION", description);
    },
  }
);
