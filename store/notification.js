export const state = () => ({
  contents: [],
});

export const mutations = {
  readNotification(state, id) {
    let index = state.contents.findIndex((n) => n.id === id);
    state.contents[index].status = "read";
  },
  clearNotifications(state) {
    state.contents = state.contents.filter((n) => n.status === "unread");
  },
  setNotifications(state, notifications) {
    state.contents = notifications;
  },
};

export const actions = {
  async getNotifications({ commit }, userId) {
    const notifications = await this.$axios.$get(
      `notification?userId=${userId}`
    );
    commit("setNotifications", notifications);
  },
  async readNotification({ commit }, id) {
    await this.$axios.$put(`notification/${id}/read`);
    commit("readNotification", id);
  },
};
