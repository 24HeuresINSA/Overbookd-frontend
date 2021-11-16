<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template #activator="{ on }">
      <v-btn color="primary" dark class="mx-auto" v-on="on" @click="open">
        <v-icon left>mdi-clock-outline</v-icon> ADDME
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">meeeeeee</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="title" label="Title" required></v-text-field>
        <v-text-field
          v-model="description"
          label="Description"
          required
        ></v-text-field>
        <v-text-field
          v-model="start"
          label="Heure de début"
          required
        ></v-text-field>
        <v-text-field
          v-model="end"
          label="Heure de fin"
          required
        ></v-text-field>
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
export default {
  name: "OverTimeslotAdder",
  data() {
    return {
      dialog: false,
      title: "",
      description: "",
      start: "",
      end: "",
    };
  },
};
</script>

<style></style>
