<template>
  <v-data-table :headers="headers" :items="equipments">
    <template #[`item.action`]="{ item, index }">
      <div style="display: flex; align-items: center">
        <v-text-field
          style="max-width: 200px"
          type="number"
          label="# requit"
          :value="item.required"
          @change="updateItems(item, $event)"
        ></v-text-field>
        <v-btn icon>
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: "LogisticsTable",
  props: {
    type: {
      type: String,
      default: () => "",
    },
    store: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    headers: [
      { text: "nom", value: "name" },
      { text: "action", value: "action" },
    ],
  }),
  computed: {
    mFA: function () {
      return this.$store.state.FA.mFA;
    },
    equipments: function () {
      return this.mFA.equipments;
    },
  },
  methods: {
    updateItems(item, e) {
      console.log(item);
      console.log(e);
      this.store.updateEquipmentRequiredCount({ _id: item._id, count: +e });
    },
  },
};
</script>

<style scoped></style>
