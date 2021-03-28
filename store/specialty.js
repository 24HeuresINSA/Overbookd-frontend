export const state = () => ({
  content: [],
  fetched: false,
});

export const mutations = {
  setSpecialties(state, specialties) {
    state.content = specialties;
    state.fetched = specialties;
  },
};

export const actions = {
  async getSpecialties({ commit, state }, payload) {
    if (!state.fetched) {
      const specialties = await this.$axios.$get("specialty");
      commit("setSpecialties", specialties);
    }
  },
};
