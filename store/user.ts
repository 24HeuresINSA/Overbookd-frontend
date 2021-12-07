import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { User } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const UserRepo = RepoFactory.userRepo;

interface State {
  me: User | undefined;
  mUser: User | undefined;
  //todo no anys
  usernames: Array<any>;
  timeslots: any;
}

export const state = (): State => ({
  me: undefined,
  usernames: [],
  mUser: undefined,
  timeslots: [],
});

export type UserState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_USER(state: UserState, data: User) {
    state.me = data;
  },
  SET_SELECTED_USER(state: UserState, data: User) {
    state.mUser = data;
  },
  SET_USERNAMES(state: UserState, data: User[]) {
    data.sort();
    state.usernames = data;
  },
  UPDATE_USER(state: UserState, data: Partial<User>) {
    Object.assign(state.me, data);
  },
  SET_TIMESLOTS(state: UserState, data: any) {
    state.timeslots = data;
  },
});

export const getters = getterTree(state, {
  /**
   * Get all avaibilies of mUser.
   * @returns Availabilies ids array
   */
  availabilities: (state: UserState): undefined | any => {
    if (!state.mUser) {
      return undefined;
    }
    return state.mUser.availabilities.map((_id) => {
      return state.timeslots.find((_timeslot: any) => _timeslot === _id);
    });
  },
  hasRole(state: UserState) {
    return (roles: string | string[]): boolean => {
      if (roles === undefined) {
        return false;
      }
      const teams = state.me.team;
      if (teams === undefined) {
        return false;
      }
      if (typeof roles == "string") {
        roles = [roles];
      }
      //admin has access to everything
      if (teams.includes("admin")) {
        return true;
      }
      return roles.some((r) => teams.includes(r));
    };
  },
});

export const actions = actionTree(
  { state },
  {
    async setSelectedUser({ commit, state }, user: User) {
      commit("SET_SELECTED_USER", user);
      if (state.timeslots.length === 0) {
        const timeslots = (await this.$axios.get("/availabilities")).data;
        commit("SET_TIMESLOTS", timeslots);
      }
    },
    async fetchUser({ commit }) {
      const res = await safeCall(this, UserRepo.getMyUser(this));
      if (res) {
        commit("SET_USER", res.data);
      }
    },
    async fetchUsernames({ commit }) {
      const res = await safeCall(this, UserRepo.getAllUsernames(this));
      if (res) {
        commit("SET_USERNAMES", res.data);
      }
    },
    /**
     * Query database and then retrieve username for the user with given UserID
     * @param userID ID of the user
     * @returns username
     */
    async getUsername({ dispatch, state }, userID) {
      if (state.usernames.length === 0) {
        await dispatch("fetchUsernames");
      }
      const u = state.usernames.find((u) => u._id === userID);
      if (u) {
        return u.username;
      }
    },
    async updateUser(
      { commit },
      payload: { userID: string; userData: Partial<User> }
    ) {
      const res = await safeCall(
        this,
        UserRepo.updateUser(this, payload.userID, payload.userData)
      );
      if (res) {
        commit("UPDATE_USER", payload.userData);
        return true;
      }
      return false;
    },

    // hasRole(state, roles: string | string[]) {
    //   if (roles === undefined) {
    //     return false;
    //   }
    //   const teams = state.state.me.team;
    //   if (teams === undefined) {
    //     return false;
    //   }
    //   if (typeof roles == "string") {
    //     roles = [roles];
    //   }
    //   return roles.some((r) => teams.includes(r));
    // },

    async acceptSelection({ commit }, timeslotIDS: string[]) {
      const res = await safeCall(
        this,
        UserRepo.acceptSelection(this, timeslotIDS)
      );
      if (res) {
        commit("UPDATE_USER", res.data);
      }
      return;
    },
  }
);

/**
 * @deprecated
 */
export interface UserActions {
  fetchUser: number;
  updateUser: { userID: string; userData: Partial<User> };
}
