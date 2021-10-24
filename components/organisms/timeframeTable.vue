<template>
  <v-card>
    <v-card-title>Créneaux</v-card-title>

    <v-data-table :headers="headers" :items="mFA.timeframes">
      <template #[`item.date`]="{ item }">
        {{ new Date(item.start).toDateString() }}
      </template>
      <template #[`item.start`]="{ item }">
        {{ new Date(item.start).toLocaleTimeString() }}
      </template>
      <template #[`item.end`]="{ item }">
        {{ new Date(item.end).toLocaleTimeString() }}
      </template>
    </v-data-table>

    <TimeframeSelector @add-timeframe="addTimeframe"> </TimeframeSelector>
  </v-card>
</template>

<script>
import TimeframeSelector from "./form/timeframeSelector";

export default {
  name: "TimeframeTable",
  components: { TimeframeSelector },
  props: {
    initTimeframes: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    headers: [
      { text: "date", value: "date" },
      { text: "debut", value: "start" },
      {
        text: "fin",
        value: "end",
      },
      { text: "action", value: "action" },
    ],
  }),
  computed: {
    mFA: function () {
      return this.$store.state.FA.mFA;
    },
  },
  methods: {
    addTimeframe(timeframe) {
      this.$accessor.FA.addTimeframeToFA(timeframe);
    },
  },
};
</script>

<style scoped></style>
