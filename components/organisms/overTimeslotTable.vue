<template>
  <v-card>
    <v-card-title> TODO: GROUTITLES {{ roles }} </v-card-title>
    <v-data-table
      v-model="selectedItems"
      :headers="headers"
      :items="items"
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
      <template
        v-if="roles.some((e) => editorTeams.includes(e))"
        #item.actions="{ item }"
      >
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template #footer.prepend>
        <v-btn color="error" @click="removeItems">
          <v-icon left> mdi-plus </v-icon>
          Supprimer la selection
        </v-btn>

        <v-btn color="success" @click="acceptSelection"
          ><v-icon left> mdi-plus </v-icon> Me rendre disponible sur les
          créneaux selectionnés
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Vue from "vue";
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
        {
          text: "Charisme",
          value: "charisma",
          sortable: false,
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
      selectedItems: [],
      editorTeams: ["admin", "humain", "bural"],
    };
  },
  computed: {
    items() {
      return this.overTimeslotTable();
    },
    roles() {
      return this.$accessor.user.me.team;
    },
  },
  methods: {
    overTimeslotTable() {
      //TODO better style for date !
      return this.timeslots.map((timeslot) => {
        return {
          id: timeslot._id,
          name: timeslot.groupTitle,
          start:
            this.padTime(new Date(timeslot.timeFrame.start).getHours()) +
            ":" +
            this.padTime(new Date(timeslot.timeFrame.start).getMinutes()),
          end:
            this.padTime(new Date(timeslot.timeFrame.end).getHours()) +
            ":" +
            this.padTime(new Date(timeslot.timeFrame.end).getMinutes()),
          date:
            new Date(timeslot.timeFrame.start).getFullYear() +
            "-" +
            (new Date(timeslot.timeFrame.start).getMonth() + 1) +
            "-" +
            new Date(timeslot.timeFrame.start).getDate(),
          charisma: timeslot.charisma,
        };
      });
    },
    async editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      await Vue.nextTick();
      this.$refs.dialog.open();
    },
    async enterSelect() {
      console.log(this.selectedItems.length);
      this.$emit("select", this.selectedItems);
    },
    async acceptSelection() {
      //TODO
    },
    async removeItems() {
      //TODO
    },
    padTime(time) {
      if (time < 10) {
        return "0" + time;
      }
      return time;
    },
  },
};
</script>

<style></style>
