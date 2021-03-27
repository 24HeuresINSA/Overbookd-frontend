<template>
  <v-app-bar app clipped-left>
    <v-btn icon @click="changeDrawerStatus">
      <v-icon>mdi-{{ drawerIcon }}</v-icon>
    </v-btn>
    <div>
      <v-list-item dense>
        <v-list-item-avatar>
          <v-img src="user.svg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ userName }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </div>
    <v-spacer v-if="!searchBarActive"></v-spacer>
    <v-text-field
      v-else
      v-model="searchContent"
      :autofocus="searchBarActive"
      label="Search..."
      single-line
      hide-details
    ></v-text-field>
    <v-btn icon @click="searchBarActive = !searchBarActive">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-menu offset-y :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-switch
            inset
            flat
            v-model="darkMode"
            label="Dark Mode"
            hide-details
          ></v-switch>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu offset-y :close-on-content-click="false" class="notificationMenu">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon>
          <v-icon :color="notificationIcon.color">
            mdi-{{ notificationIcon.icon }}
          </v-icon>
        </v-btn>
      </template>
      <navigation-notification-menu></navigation-notification-menu>
    </v-menu>
    <v-divider vertical></v-divider>
    <v-btn text tile @click="logout"> Disconnect </v-btn>
  </v-app-bar>
</template>

<script>
import jwt_decode from "jwt-decode";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "AppBar",
  data: () => ({
    darkMode: false,
    searchBarActive: false,
    searchContent: "",
  }),
  computed: {
    userName: function () {
      return this.user.firstName + " " + this.user.lastName;
    },
    drawerIcon: function () {
      return this.$store.state.navigation.drawer
        ? "chevron-left"
        : "chevron-right";
    },
    notificationIcon: function () {
      if (this.$store.state.notification.contents.length != 0) {
        return this.$store.state.notification.contents.find(
          (n) => n.status === "unread"
        )
          ? { icon: "bell-ring", color: "red" }
          : { icon: "bell", color: "grey" };
      } else return { icon: "bell", color: "grey" };
    },
    ...mapState({
      user: (state) => state.user.user,
    }),
  },
  async mounted() {
    if (!this.$store.state.user.userFetched) {
      const keycloakUserId = jwt_decode(this.$auth.strategy.token.get()).sub;
      const user = await this.$axios.$get(
        `user?keycloakUserId=${keycloakUserId}`
      );
      this.$store.commit("user/setUser", { user: user[0] });
    }
    await this.getNotifications(this.$store.state.user.user.id);
    this.$store.commit("navigation/loaded");
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      await this.$router.push("/login");
    },
    ...mapMutations({
      changeDrawerStatus: "navigation/changeDrawerStatus",
    }),
    ...mapActions({
      getNotifications: "notification/getNotifications",
    }),
  },
  watch: {
    darkMode: function (newVal, oldVal) {
      this.$vuetify.theme.dark = newVal;
    },
  },
};
</script>

<style lang="scss" scoped>
.switchCenter,
v-switch {
  display: flex;
  justify-content: center;
  align-items: center;
}

.notificationMenu {
  min-width: 100px;
}
</style>
