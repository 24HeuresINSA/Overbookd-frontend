<template>
  <v-card class="item-wrapper">
    <v-row>
      <v-app-bar flat color="rgba(0, 0, 0, 0)">
        <v-toolbar-title class="title pl-0">
          {{ title }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="removeModule(id)" v-if="configurable">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
    </v-row>
    <v-row>
      <slot />
    </v-row>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "ItemWrapper",
  props: { id: String, title: String },
  computed: {
    ...mapState({
      configurable: (state) => state.user.config.modulesConfigurable,
    }),
  },
  methods: {
    ...mapMutations({
      removeModule: "user/removeModule",
    }),
  },
};
</script>

<style lang="scss" scoped>
.item-wrapper {
  padding: 15px;
  margin-bottom: 3vh;
  margin-right: 3vw;
  min-width: 30vw;
  max-width: 35vw;
  min-height: 35vh;
  max-height: 45vh;
}
</style>
