<template>
  <div>
    <H1>Password reset</H1>
    <v-form>
      <v-container class="form-container">
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
    password: "pass",
    password2: "pass2",
  }),
  methods: {
    sendResetRequest: async function () {
      const res = await this.$safeCall(
        this.$store,
        RepoFactory.authRepo.resetPassword(this, {
          token: this.$route.params.token,
          password: this.password,
          password2: this.password2,
        })
      );
      if (res) {
        console.log("Password resetted succesfully");
        await this.$router.push({
          path: "/login",
        });
      }
    },
  },
});
</script>
