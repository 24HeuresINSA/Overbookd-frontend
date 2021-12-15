<template>
  <div>
    <v-data-table> </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as FAHandler from "~/utils/models/FA";

export default Vue.extend({
  name: "Security",
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name",
          sortable: true,
          align: "left",
          width: "200",
        },
        {
          text: "Description",
          value: "description",
          sortable: true,
          align: "left",
          width: "200",
        },
        {
          text: "Action",
          value: "action",
          sortable: false,
          align: "left",
          width: "200",
        },
      ],
    };
  },
  computed: {
    FAs(): FAHandler.FA[] {
      return this.$accessor.FA.FAs;
    },
    items(): any {
      return this.FAs.map((fa) => {
        return {
          name: fa._id,
          description: fa.securityPasses,
          action: "<v-btn icon>" + "<v-icon>mdi-pencil</v-icon>" + "</v-btn>",
        };
      });
    },
  },
  beforeCreate() {
    if (!this.$accessor.user.hasRole("secu")) {
      this.$router.push("/");
    }
  },
  async mounted() {
    if (!(await this.$accessor.FA.fetchAll())) {
      console.log("Error fetching FAs");
    }
    console.log(this.FAs[0]);
  },
});
</script>

<style></style>
