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
    timeframes: [],
  }),
  watch: {
    timeframes: {
      deep: true,
      handler: function () {
        this.$emit("form-change", this.timeframes);
      },
    },
  },
  mounted() {
    this.initTimeframes.forEach((tf) => this.timeframes.push(tf));
  },
  methods: {
    addTimeframe(timeframe) {
      this.timeframes.push(timeframe);
    },
  },
};
</script>

<style scoped></style>
