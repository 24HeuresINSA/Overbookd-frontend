<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <LogisticsTable :type="type" :store="store"></LogisticsTable>
    <LogisticsSelector :type="type" :store="store"></LogisticsSelector>
  </v-card>
</template>

<script>
import LogisticsTable from "./LogisticsTable";
import LogisticsSelector from "./LogisticsSelector";

export default {
  name: "LogisticsCard",
  components: { LogisticsSelector, LogisticsTable },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "",
    },
    store: {
      type: Object,
      default: () => null,
    },
  },
};
</script>

<style scoped></style>
