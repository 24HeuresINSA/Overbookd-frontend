<template>
  <v-data-table :headers="headers" :items="inventory" dense>
    <template #[`item.action`]="{ item }">
      <v-btn icon @click="addItemToFA(item)">
        <v-icon> mdi-plus</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { RepoFactory } from "../../../repositories/repoFactory";

export default {
  name: "LogisticsSelector",
  props: {
    types: {
      type: Array,
      default: () => [],
    },
    store: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({
    repo: RepoFactory.equipmentRepo,
    headers: [
      { text: "nom", value: "name" },
      { text: "action", value: "action" },
    ],
    fullInventory: [],
    inventory: [],
  }),
  watch: {
    types() {
      if (this.types) {
        this.inventory = this.fullInventory.filter((e) =>
          this.types.includes(e.type)
        );
      }
      return [];
    },
  },
  async mounted() {
    this.fullInventory = (await this.repo.getAllEquipments(this)).data;
  },
  methods: {
    addItemToFA(item) {
      this.store.addEquipmentToFA({
        _id: item._id,
        name: item.name,
        type: item.type,
      });
    },
  },
};
</script>

<style scoped></style>
