export const state = () => ({
  id: 1,
  user: {
    first_name: "Thibaut",
    last_name: "Bellanger",
    email: "t.bellanger34@gmail.com",
    teams: [
      { id: "orga", title: "Organizer" },
      { id: "admin", title: "Admin" },
      { id: "oldTimer", title: "Old Timer" },
      { id: "t1", title: "Old Timer" },
      { id: "t2", title: "Old Timer" },
      { id: "t3", title: "Old Timer" },
    ],
  },
  authenticated: false,
  config: {
    modulesConfigurable: false,
    modules: ["teams"],
  },
});

export const mutations = {
  setUser(state, payload) {
    state.user = payload.user;
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
