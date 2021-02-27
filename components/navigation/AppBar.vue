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
        <v-btn v-bind="attrs" v-on="on" icon flat>
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
        <v-btn v-bind="attrs" v-on="on" icon flat>
          <v-icon :color="notificationIcon.color">
            mdi-{{ notificationIcon.icon }}
          </v-icon>
        </v-btn>
      </template>
      <navigation-notification-menu></navigation-notification-menu>
    </v-menu>
    <v-divider vertical></v-divider>
    <v-btn text tile> Disconnect </v-btn>
  </v-app-bar>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "AppBar",
  data: () => ({
    user: {
      first_name: "Thibaut",
      last_name: "Bellanger",
      email: "t.bellanger34@gmail.com",
    },
    darkMode: false,
    searchBarActive: false,
    searchContent: "",
  }),
  computed: {
    userName: function () {
      return this.user.first_name + " " + this.user.last_name;
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
  },
  methods: {
    ...mapMutations({
      changeDrawerStatus: "navigation/changeDrawerStatus",
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
