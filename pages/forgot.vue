<template>
  <div>
    <v-form>
      <v-container class="form-container">
        <v-row><p>Entre l'email de ton compte.</p></v-row>
        <v-row>
          <v-text-field
            v-model="userEmail"
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
        <v-btn @click="sendResetRequest()">Envoyer</v-btn>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { safeCall } from "~/utils/api/calls";
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
      const res = await safeCall(
        this.$store,
        RepoFactory.authRepo.requestResetPassword(this, {
          userEmail: this.userEmail,
        })
      );
      if (res) {
        await this.$router.push({
          path: "/",
        }); // redirect to login page
      } else {
        // todo handle error
      }
      return;
    },
  },
});
</script>

<style>
.form-container {
  align-self: center;
  justify-self: center;
  margin-top: 10%;
  width: 75%;
  max-width: 600px;
}
</style>
