<template>
  <v-container>
    <h1>Transactions 💸</h1>
    <v-card style="margin-bottom: 5px">
      <v-card-text
        style="display: flex; flex-direction: row; align-items: center"
      >
        <v-autocomplete
          v-model="selectedUserKeycloakID"
          label="Nom"
          :items="usernames"
          item-text="username"
          item-value="keycloakID"
          style="width: 300px"
        ></v-autocomplete>
        <v-btn text @click="search(selectedUserKeycloakID)">Chercher</v-btn>
      </v-card-text>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="filteredTransactions"
      dense
      :items-per-page="-1"
      sort-by="createdAt"
    >
      <template #[`group.summary`]="{ group }">
        {{ new Date(group).toLocaleString() }}
      </template>

      <template #[`item.type`]="{ item }">
        <label
          v-if="item.isValid === false"
          style="text-decoration: line-through"
        >
          {{ item.type }}
        </label>
        <label v-else>
          {{ item.type }}
        </label>
      </template>

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
      filteredTransactions: [],
      usernames: [],
      selectedUserKeycloakID: undefined,
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
      this.usernames = usersCall.data;
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
      this.filteredTransactions = this.transactions;
    }
  },

  methods: {
    getFullNameFromKeycloakID(keycloakID) {
      return this.users[keycloakID];
    },
    async deleteTransaction(transactionID) {
      const deleteCall = await safeCall(
        this.$store,
        RepoFactory.transactionRepo.deleteTransaction(this, transactionID)
      );
      if (deleteCall) {
        // update on screen
        let mTransactions = this.transactions.find(
          (t) => t._id !== transactionID
        );
        mTransactions.isValid = false;
      }
    },
    search(keycloakID) {
      this.filteredTransactions = this.transactions.filter((t) => {
        return t.from === keycloakID || t.to === keycloakID;
      });
    },
  },
};
</script>

<style scoped></style>
