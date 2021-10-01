<template>
  <v-container style="padding: 0">
    <v-chip-group>
      <v-chip v-for="(role, i) in mRoles" :key="i" :color="role.color">
        <v-icon left color="white">
          {{ role.icon }}
        </v-icon>
        <a style="color: white">{{ role.name }}</a>
      </v-chip>
    </v-chip-group>
  </v-container>
</template>

<script>
export default {
  name: "OverChips",
  props: {
    roles: {
      type: Array,
      required: true,
    },
  },

  computed: {
    mRoles() {
      return this.$accessor.config.getConfigTeams(this.roles);
    },
  },
};
</script>

<style scoped></style>
