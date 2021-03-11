<template>
  <div fill-height fluid class="container">
    <dashboard-item-wrapper
      id="teams"
      title="My Teams"
      v-if="moduleIDs.includes('teams')"
    >
      <dashboard-teams class="module" />
    </dashboard-item-wrapper>
    <v-menu min-width="120px" min-height="120px" top offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab fixed bottom right v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-switch
            inset
            flat
            v-model="configureDashboard"
            label="Configure dashboard"
            hide-details
          ></v-switch>
        </v-list-item>
        <v-list-item
          v-for="module in modules"
          :key="module.id"
          :disabled="moduleIDs.includes(module.id)"
        >
          <v-list-item-content>{{ module.title }}</v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              v-if="!moduleIDs.includes(module.id)"
              @click="addModule(module.id)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "dashboard",
  data: () => ({
    configureDashboard: false,
    modules: [{ id: "teams", title: "My Teams" }],
  }),
  computed: {
    ...mapState({
      moduleIDs: (state) => state.user.config.modules,
    }),
  },
  methods: {
    ...mapMutations({
      addModule: "user/addModule",
      toggleModulesConfigurable: "user/toggleModulesConfigurable",
    }),
  },
  watch: {
    configureDashboard: function (newVal, oldVal) {
      this.toggleModulesConfigurable();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  padding: 10px;
}
.module {
  height: 100%;
}
</style>
