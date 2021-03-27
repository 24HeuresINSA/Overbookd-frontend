export const state = () => ({
  id: 1,
  user: {},
  userFetched: false,
  teams: [],
  authenticated: false,
  config: {
    modulesConfigurable: false,
    modules: ["teams", "infos"],
  },
});

export const mutations = {
  setUser(state, payload) {
    state.user = payload.user;
    state.userFetched = true;
  },
  setTeams(state, payload) {
    state.teams = payload.teams;
  },
  toggleModulesConfigurable(state) {
    state.config.modulesConfigurable = !state.config.modulesConfigurable;
  },
  removeModule(state, id) {
    state.config.modules = state.config.modules.filter((m) => m !== id);
  },
  addModule(state, id) {
    if (!state.config.modules.includes(id)) {
      state.config.modules.push(id);
    }
  },
};

export const actions = {
  async getUserByKeycloakId({ commit, state }, payload) {
    if (!state.userFetched) {
      const user = await this.$axios.$get(
        `user?keycloakUserId=${payload.keycloakUserId}`
      );
      commit("setUser", { user: user[0] });
    }
  },
  async getUserTeams({ commit, state }) {
    const user = await this.$axios.$get(`user/team?id=${state.user.id}`);
    commit("setTeams", { teams: user[0].teams });
  },
};
