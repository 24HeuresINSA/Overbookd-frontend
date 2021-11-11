<template>
  <v-card></v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "OverChips",
  props: {
    roles: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
  },

  computed: {
    mRoles() {
      return this.$accessor.config.getConfigTeams(this.roles);
    },
  },
});
</script>

<style scoped></style>
