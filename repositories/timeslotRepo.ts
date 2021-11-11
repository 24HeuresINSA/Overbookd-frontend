import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { timeslot } from "~/utils/models/repo";

const resource = "/timeslot";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllTimeslots(context: Context) {
    return context.$axios.get(`${resource}`);
  },
  getTimeslotById(context: Context, id: string) {
    return context.$axios.get(`${resource}/${id}`);
  },

  // POST
  createTimeslot(context: Context, availabilities: timeslot[]) {
    return context.$axios.post(`${resource}`, availabilities);
  },

  // DELETE
  deleteTimeslot(context: Context, id: string) {
    return context.$axios.delete(`${resource}/${id}`);
  },
};
