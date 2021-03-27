export const state = () => ({
  drawer: true,
  loaded: false,
});

export const mutations = {
  changeDrawerStatus(state) {
    state.drawer = !state.drawer;
  },
  loaded(state) {
    state.loaded = true;
  },
};
