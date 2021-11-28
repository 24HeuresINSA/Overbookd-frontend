<template>
  <div>
    <H1>Password reset</H1>
    <v-form>
      <v-container class="form-container">
        <v-row>
          <v-text-field
            v-model="email"
            label="email"
            type="text"
            required
            autofocus
            outlined
            clearable
            solo
            filled
            @keydown.enter="sendResetRequest()"
          ></v-text-field>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RepoFactory } from "~/repositories/repoFactory";
export default Vue.extend({
  name: "ForgotPassword",
  //@ts-ignore
  auth: false,
  layout: "none",
  data: () => ({
    userEmail: "",
  }),
  methods: {
    sendResetRequest: async function () {
      // todo: Notify user
      const res = await this.$safeCall(
        this.$store,
        RepoFactory.authRepo.requestResetPassword(this, {
          userEmail: this.userEmail,
        })
      );
      if (res) {
        console.log("Reset request sent succesfully");
      }
    },
  },
});
</script>
