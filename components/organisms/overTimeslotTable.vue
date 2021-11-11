<template>
  <v-card>
    <v-card-title> TODO: GROUTITLES {{ da }} </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      class="elevation-1"
      show-select
      dense
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon>mdi-clock-outline</v-icon>
            <span class="title">Over Timeslots</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <OverTimeslotDialog
            ref="dialog"
            :timeslot="editedItem"
          ></OverTimeslotDialog>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import OverTimeslotDialog from "../atoms/OverTimeslotDialog";

export default {
  name: "OverTimeslotTable",
  components: {
    OverTimeslotDialog,
  },
  props: {
    timeslots: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Heure de début",
          value: "start",
        },
        { text: "Heure de fin", value: "end" },
        {
          text: "Date",
          value: "date",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: "",
        groupTitle: "",
        start: "",
        end: "",
        date: "",
      },
    };
  },
  computed: {
    items() {
      return this.overTimeslotTable();
    },
    da() {
      return this.$accessor.timeslot.date;
    },
  },
  methods: {
    overTimeslotTable() {
      return this.timeslots.map((timeslot) => {
        return {
          id: timeslot._id,
          name: timeslot.groupTitle,
          start:
            new Date(timeslot.timeFrame.start).getHours() +
            ":" +
            new Date(timeslot.timeFrame.start).getMinutes(),
          end:
            new Date(timeslot.timeFrame.end).getHours() +
            ":" +
            new Date(timeslot.timeFrame.end).getMinutes(),
          date:
            new Date(timeslot.timeFrame.start).getFullYear() +
            "-" +
            (new Date(timeslot.timeFrame.start).getMonth() + 1) +
            "-" +
            new Date(timeslot.timeFrame.start).getDate(),
        };
      });
    },
    async editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.$refs.dialog.open();
    },
  },
};
</script>

<style></style>
