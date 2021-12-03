<template>
  <div>
    <v-form>
      <v-container class="form-container">
        <v-row><p>Rentre ton nouveau mot de passe.</p></v-row>
        <v-row>
          <v-text-field
            v-model="password"
            label="password"
            type="password"
            required
            autofocus
            outlined
            clearable
            solo
            filled
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="password2"
            label="re-enter password"
            type="password"
            required
            outlined
            clearable
            solo
            filled
            @keydown.enter="sendResetRequest()"
          ></v-text-field>
        </v-row>
        <v-btn @click="sendResetRequest()">Valider</v-btn>
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
    password: "",
    password2: "",
  }),
  methods: {
    sendResetRequest: async function () {
      const res = await safeCall(
        this.$store,
        RepoFactory.authRepo.resetPassword(this, {
          token: this.$route.params.token,
          password: this.password,
          password2: this.password2,
        })
      );
      if (res) {
        await this.$router.push({
          path: "/",
        });
      }
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
