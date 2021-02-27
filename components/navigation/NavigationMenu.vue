<template>
  <v-navigation-drawer app clipped v-model="drawer">
    <v-list flat nav>
      <v-list-item>
        <v-col class="align-center" absolute>
          <v-img :src="overbookd_logo" alt="overbookd logo"></v-img>
        </v-col>
      </v-list-item>
      <v-list-item link :to="dashboard.url" nav>
        <v-list-item-icon>
          <v-icon>{{ dashboard.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ dashboard.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-expansion-panels flat accordion v-model="panel">
        <v-expansion-panel v-for="(item, i) in items" :key="i">
          <v-expansion-panel-header
            :expand-icon="item.icon"
            disable-icon-rotate
          >
            {{ item.title }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item
                v-for="(dropdown, i) in item.items"
                :key="i"
                :to="item.url + dropdown.url"
                link
              >
                <v-list-item-title>{{ dropdown.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavigationMenu",
  data: () => ({
    dashboard: { title: "Dashboard", icon: "mdi-view-dashboard", url: "/" },
    panel: [],
    items: [
      {
        title: "Create",
        icon: "mdi-pencil",
        url: "/create",
        roles: ["user_modifier"],
        items: [
          { title: "Task", url: "/task", roles: ["user_modifier"] },
          { title: "Activity", url: "/activity", roles: ["user_modifier"] },
          { title: "Location", url: "/location", roles: ["user_modifier"] },
          { title: "User", url: "/user", roles: ["user_admin"] },
          { title: "Team", url: "/team", roles: ["user_affect"] },
        ],
      },
      {
        title: "Show",
        icon: "mdi-eye",
        url: "/show",
        roles: ["user"],
        items: [
          { title: "Task", url: "/task", roles: ["user"] },
          { title: "Activity", url: "/activity", roles: ["user"] },
          { title: "Location", url: "/location", roles: ["user"] },
          { title: "User", url: "/user", roles: ["user"] },
          { title: "Equipment", url: "/equipment", roles: ["user"] },
          { title: "Team", url: "/team", roles: ["user_affect"] },
        ],
      },
      {
        title: "Assign",
        icon: "mdi-account-multiple",
        url: "/affect",
        roles: ["user_affect"],
        items: [
          { title: "By user", url: "/user", roles: ["user_affect"] },
          { title: "By task", url: "/task", roles: ["user_affect"] },
        ],
      },
    ],
  }),
  computed: {
    drawer: function () {
      return this.$store.state.navigation.drawer;
    },
    overbookd_logo: function () {
      return this.$vuetify.theme.dark
        ? "overbookd_logo_blanc.png"
        : "overbookd_logo_noir.png";
    },
  },
};
</script>
