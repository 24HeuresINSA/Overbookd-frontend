<template>
  <v-dialog v-model="dialog" persistent max-width="900px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="equipmentProposal.isNewEquipment" color="blue-grey">
          <v-icon>mdi-alert-circle-outline</v-icon>
          {{ message }}
        </v-alert>
        {{ equipmentProposal.name }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Annuler</v-btn
        >
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Refuser la proposition</v-btn
        >
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Accpeter la proposition</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "EquipmentProposalValidationDialog",
  props: {
    equipmentProposal: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      title: "Proposition de",
      message: "C'est un nouvel equipement",
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
  },
});
</script>

<style></style>
