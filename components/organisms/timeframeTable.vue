<template>
  <v-card>
    <v-card-title>Créneaux</v-card-title>

    <v-data-table :headers="headers" :items="timeframes">
      <template #[`item.date`]="{ item }">
        {{ item.start.toDateString() }}
      </template>
      <template #[`item.start`]="{ item }">
        {{ item.start.toLocaleTimeString() }}
      </template>
      <template #[`item.end`]="{ item }">
        {{ item.end.toLocaleTimeString() }}
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
    initTimeframe: {
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
    timeframes: [],
  }),
  mounted() {
    this.initTimeframe.forEach((tf) => this.timeframes.push(tf));
  },
  methods: {
    addTimeframe(timeframe) {
      this.timeframes.push(timeframe);
      console.log(this.timeframes);
    },
  },
};
</script>

<style scoped></style>
