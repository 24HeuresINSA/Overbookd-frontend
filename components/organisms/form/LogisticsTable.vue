<template>
  <v-data-table :headers="headers" :items="equipments"></v-data-table>
</template>
<script>
export default {
  name: "LogisticsTable",
  props: {
    type: {
      type: String,
      default: () => "",
    },
    store: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    headers: [
      { text: "nom", value: "name" },
      { text: "action", value: "action" },
    ],
  }),
  computed: {
    mFA: function () {
      return this.$store.state.FA.mFA;
    },
    equipments: function () {
      return this.mFA.equipments;
    },
  },
};
</script>

<style scoped></style>
