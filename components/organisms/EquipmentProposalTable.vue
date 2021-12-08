<template>
  <v-card>
    <v-data-table :headers="headers" :items="equipmentProposals">
      <template #item.actions="{ item }">
        <v-btn icon @click="$emit('edit', item)">
          <v-icon>mdi-circle-edit-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "EquipmentProposalTable",
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name",
          sortable: true,
          align: "left",
        },
        {
          text: "Lieu",
          value: "location",
          sortable: true,
          align: "left",
        },
        {
          text: "Action",
          value: "actions",
          sortable: true,
          align: "left",
        },
      ],
    };
  },
  computed: {
    equipmentProposals() {
      return this.$accessor.equipmentProposal.equipmentProposals;
    },
  },
  async mounted() {
    await this.$accessor.equipmentProposal.getEquipmentProposal();
    console.log(this.equipmentProposals);
  },
});
</script>

<style></style>
