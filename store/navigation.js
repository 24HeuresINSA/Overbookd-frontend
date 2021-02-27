export const state = () => ({
  drawer: true,
});

export const mutations = {
  changeDrawerStatus(state) {
    state.drawer = !state.drawer;
  },
};
