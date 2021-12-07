<template>
  <v-dialog
    v-model="dialog"
    width="100%"
    height="100%"
    transition="dialog-bottom-transition"
  >
    <EquipmentProposalTable></EquipmentProposalTable>
  </v-dialog>
</template>

<script lang="ts">
import EquipmentProposalTable from "./EquipmentProposalTable.vue";

export default {
  name: "EquipmentProposalDialogPage",
  components: { EquipmentProposalTable },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
  },
};
</script>

<style></style>
