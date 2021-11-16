<template>
  <v-dialog v-model="dialog">
    <template #activator="{ on }">
      <v-btn color="primary" dark class="mx-auto" v-on="on" @click="open">
        <v-icon left>mdi-clock-outline</v-icon> ADD TIMESLOT
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Edition De Dispo</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-model="overTimeslot.groupTitle"
                label="Groupe du timeslot"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="overTimeslot.groupDescription"
                label="Description"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <OverDatePicker
                label="Date de début"
                @update:date="overTimeslot.date = $event"
              >
              </OverDatePicker>
            </v-flex>
            <v-flex xs12>
              <OverTimePicker
                label="Date de fin"
                @update:time="overTimeslot.start = $event"
              ></OverTimePicker>
            </v-flex>
            <v-flex xs12>
              <OverTimePicker
                :d-time="overTimeslot.end"
                @update:time="overTimeslot.start = $event"
              ></OverTimePicker>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import OverTimePicker from "./OverTimePicker.vue";
import OverDatePicker from "./OverDatePicker.vue";
export default Vue.extend({
  name: "OverTimeslotDialog",
  components: {
    OverTimePicker,
    OverDatePicker,
  },
  props: {
    timeslot: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      overTimeslot: {
        groupTitle: this.timeslot.groupTitle,
        groupDescription: this.timeslot.groupDescription,
        start: this.timeslot.start,
        end: this.timeslot.end,
        date: this.timeslot.date,
      },
      dialog: false,
    };
  },
  watch: {
    timeslot() {
      this.overTimeslot.groupTitle = this.timeslot.groupTitle;
      this.overTimeslot.groupDescription = this.timeslot.groupDescription;
      this.overTimeslot.start = this.timeslot.start;
      this.overTimeslot.end = this.timeslot.end;
      this.overTimeslot.date = this.timeslot.date;
    },
  },
  methods: {
    open() {
      console.log(this.timeslot);
      this.dialog = true;
    },
    async close() {
      this.dialog = false;
    },
    async save() {
      const timeSlot = {
        groupTitle: this.overTimeslot.groupTitle,
        groupDescription: this.overTimeslot.groupDescription,
        timeFrame: {
          start: this.overTimeslot.start,
          end: this.overTimeslot.end,
        },
        charisma: 0,
      };
      this.$store.dispatch("timeslot/addWIPTimeslot", this.overTimeslot);
    },
  },
});
</script>

<style scoped></style>
