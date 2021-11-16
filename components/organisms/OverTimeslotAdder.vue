<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template #activator="{ on }">
      <v-btn color="primary" dark class="mx-auto" v-on="on">
        <v-icon left>mdi-clock-outline</v-icon> ADDME
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Ajout de multiple créneaux </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="title"
            label="Title"
            required
            :rules="groupTitleRules"
          ></v-text-field>
          <v-text-field
            v-model="description"
            label="Description"
            required
            :rules="groupDescriptionRules"
          ></v-text-field>
          <v-text-field
            v-model="charisma"
            type="number"
            single-line
            :rules="charismaRules"
          >
          </v-text-field>
          <OverDatePicker
            label="Date de début"
            @update:date="dayStart = $event"
          >
          </OverDatePicker>
          <OverDatePicker label="Date de fin" @update:date="dayEnd = $event">
          </OverDatePicker>
          <OverTimePicker
            label="Heure de début"
            @update:time="hourStart = $event"
          ></OverTimePicker>
          <OverTimePicker
            label="Heure de fin"
            @update:time="hourEnd = $event"
          ></OverTimePicker>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" text @click="addOverTimeslot()">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import OverDatePicker from "../atoms/OverDatePicker.vue";
import OverTimePicker from "../atoms/OverTimePicker.vue";

export default {
  name: "OverTimeslotAdder",
  components: {
    OverDatePicker,
    OverTimePicker,
  },
  data() {
    return {
      dialog: false,
      title: "",
      description: "",
      hourStart: "",
      hourEnd: "",
      dayStart: "",
      dayEnd: "",
      charisma: 10,
      valid: false,
      groupTitleRules: [
        (v) => !!v || "Title is required",
        (v) => (v && v.length <= 50) || "Title must be less than 50 characters",
      ],
      groupDescriptionRules: [(v) => !!v || "Description is required"],
      charismaRules: [
        (v) => !!v || "Charisma is required",
        (v) => (v && v >= 0) || "Charisma must be greater than 0",
      ],
    };
  },
  methods: {
    addOverTimeslot() {
      this.$refs.form.validate();
      /* eslint no-constant-condition: "off" */
      if (!this.valid) return;
      let start = new Date(this.dayStart + "T" + this.hourStart + ":00");
      const end = new Date(this.dayEnd + "T" + this.hourEnd + ":00");
      const timeslots = [];
      while (true) {
        const newEnd = new Date(start);
        newEnd.setHours(newEnd.getHours() + 2);
        if (newEnd > end) {
          break;
        }
        timeslots.push({
          timeFrame: {
            start: start,
            end: newEnd,
          },
          groupTitle: this.title,
          groupDescription: this.description,
          charisma: 10,
        });
        start = new Date(newEnd);
      }
      console.log(timeslots);
      this.$store.dispatch("timeslot/addTimeslots", timeslots);
      this.dialog = false;
    },
  },
};
</script>

<style></style>
