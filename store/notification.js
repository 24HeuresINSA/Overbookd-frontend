export const state = () => ({
  contents: [
    {
      id: 1,
      content: "Vous avez un nouveau message.",
      link: "/messagebox",
      status: "unread",
      user_id: 3,
    },
    {
      id: 2,
      content: "Vous avez été mentionné dans un commentaire.",
      link: "/activity/5#comments",
      status: "unread",
      user_id: 3,
    },
    {
      id: 3,
      content: "Votre équipe a été mentionné dans un commentaire.",
      link: "/task/3#comments",
      status: "unread",
      team_id: 2,
    },
  ],
});

export const mutations = {
  readNotification(state, id) {
    let index = state.contents.findIndex((n) => n.id === id);
    state.contents[index].status = "read";
  },
  clearNotifications(state, payload) {
    state.contents = state.contents.filter((n) => n.status === "unread");
  },
};
