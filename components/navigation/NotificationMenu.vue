<template>
  <v-list class="notificationList">
    <v-list-item
      v-for="n in notifications"
      :key="n.id"
      @click="readNotification(n.id)"
      link
      :to="n.link"
    >
      <v-list-item-avatar>
        <v-icon>mdi-bell{{ n.status === "unread" ? "" : "-outline" }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        {{ n.content }}
      </v-list-item-content>
    </v-list-item>
    <v-list-item @click="clearNotifications">
      Clear all read notifications
    </v-list-item>
  </v-list>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "NotificationMenu",
  computed: {
    notifications: function () {
      return this.$store.state.notification.contents;
    },
  },
  methods: {
    ...mapMutations({
      readNotification: "notification/readNotification",
      clearNotifications: "notification/clearNotifications",
    }),
  },
};
</script>

<style lang="scss" scoped>
.notificationList {
  min-width: 45px;
}
</style>
