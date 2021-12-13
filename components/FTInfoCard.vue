<template>
  <v-card v-if="FT">
    <v-card-title>Info</v-card-title>
    <v-card-text>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FA</td>
              <td v-if="FT.FA === undefined">
                <a :href="`/fa/${FT.FA}`">{{ FT.FA }}</a>
              </td>
              <td v-else>
                <span>FT rattaché a aucune FA</span>
              </td>
            </tr>
            <tr>
              <td>Nombre de matos</td>
              <td>{{ FT.equipments.length }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FTInfoCard",
  computed: {
    FT() {
      return this.$accessor.FT.mFT;
    },
  },
});
</script>

<style scoped></style>
