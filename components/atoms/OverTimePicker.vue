<template>
  <v-dialog
    ref="dialog"
    v-model="modal2"
    :return-value.sync="time"
    persistent
    width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        label="Time"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="modal2"
      v-model="time"
      full-width
      format="24hr"
      :allowed-hours="allowedHours"
      :allowed-minutes="allowedMinutes"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modal2 = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="$refs.dialog.save(time)"> OK </v-btn>
    </v-time-picker>
  </v-dialog>
</template>
<script>
export default {
  name: "OverTimePicker",
  props: {
    dTime: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      modal2: false,
      time: this.dTime,
    };
  },
  methods: {
    allowedHours: (v) => v % 2 === 0,
    allowedMinutes: (v) => v === 0,
  },
};
</script>

<style></style>
