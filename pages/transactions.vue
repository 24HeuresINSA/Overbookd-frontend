<template>
  <v-container>
    <h1>Transactions 💸</h1>
    <v-data-table
      :headers="headers"
      :items="transactions"
      dense
      :items-per-page="-1"
    >
      <template #[`item.amount`]="{ item }">
        {{ (item.amount || 0).toFixed(2) }} €
      </template>

      <template #[`item.to`]="{ item }">
        {{ getFullNameFromKeycloakID(item.to) }}
      </template>

      <template #[`item.from`]="{ item }">
        {{ getFullNameFromKeycloakID(item.from) }}
      </template>

      <template #[`item.createdAt`]="{ item }">
        {{ new Date(item.createdAt).toLocaleString() }}
      </template>

      <template #[`item.action`]="{ item }">
        <v-btn icon small @click="deleteTransaction(item._id)">
          <v-icon small>mdi-trash-can</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
const { safeCall } = require("../utils/api/calls");
import { RepoFactory } from "~/repositories/repoFactory";

export default {
  name: "Transactions",
  data: () => {
    return {
      transactions: [],

      headers: [
        { text: "type", value: "type" },
        { text: "depuis", value: "from" },
        {
          text: "vers",
          value: "to",
        },
        { text: "context", value: "context" },
        { text: "date", value: "createdAt" },
        {
          text: "montant",
          value: "amount",
          align: "end",
        },
        { text: "action", value: "action" },
      ],

      users: {},
    };
  },
  computed: {},

  async beforeMount() {
    const usersCall = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsernames(this)
    );
    if (usersCall) {
      usersCall.data.forEach((username) => {
        this.users[username.keycloakID] = username.username;
      });
    }
  },

  async mounted() {
    if (!(await this.$accessor.user.hasRole("admin"))) {
      await this.$router.push({
        path: "/",
      });
      return;
    }

    const res = await safeCall(
      this.$store,
      RepoFactory.transactionRepo.getTransactions(this)
    );
    if (res) {
      this.transactions = res.data;
    }
  },

  methods: {
    getFullNameFromKeycloakID(keycloakID) {
      console.log(this.users);
      console.log(this.users[keycloakID]);
      return this.users[keycloakID];
    },
    async deleteTransaction(transactionID) {
      const deleteCall = await safeCall(
        this.$store,
        RepoFactory.transactionRepo.deleteTransaction(this, transactionID)
      );
      if (deleteCall) {
        // update on screen
        this.transactions = this.transactions.filter(
          (t) => t._id !== transactionID
        );
      }
    },
  },
};
</script>

<style scoped></style>
