<template>
  <v-container>
    <h1>SG 🥵</h1>
    <v-container style="display: flex; width: 100%">
      <v-card>
        <v-card-text style="display: flex; flex-direction: column">
          <label>Mode</label>
          <v-container>
            <v-btn-toggle
              v-model="mode"
              tile
              color="deep-purple accent-3"
              group
            >
              <v-btn value="cask" small> Fût</v-btn>
              <v-btn value="closet" small> Placard</v-btn>
              <v-btn value="deposit" small> Dépot</v-btn>
            </v-btn-toggle>
          </v-container>
          <v-list v-if="!areInputsValid.res">
            <v-list-item
              v-for="(reason, key) in areInputsValid.reason"
              :key="key"
            >
              <v-list-item-content style="color: red">{{
                reason
              }}</v-list-item-content>
            </v-list-item>
          </v-list>

          <template v-if="mode === 'cask'">
            <v-text-field
              v-model="totalPrice"
              label="Prix total"
              type="number"
              :rules="[
                (v) =>
                  new RegExp(regex.float).test(v) ||
                  `il faut mettre un nombre (avec . comme virgule)`,
              ]"
            ></v-text-field>
            <label> Nombre de bâton total {{ totalConsumptions }} </label>
            <label
              >Prix du bâton:
              {{ stickPrice }}
              €</label
            >
          </template>

          <template v-if="mode === 'closet'">
            <v-text-field
              v-model="settledStickPrice"
              label="Prix du bâton"
              type="number"
              :rules="[
                (v) =>
                  new RegExp(regex.float).test(v) ||
                  `il faut mettre un nombre (avec . comme virgule)`,
              ]"
            ></v-text-field>
            <label> Nombre de bâton total {{ totalConsumptions }} </label>
          </template>

          <template v-if="mode === 'deposit'">
            <label> Depot total: {{ totalConsumptions }} €</label>
          </template>
          <v-btn text :disabled="!areInputsValid.res" @click="saveTransactions"
            >Enregistrer</v-btn
          >
          <v-btn text>Envoyer un mail au négatif</v-btn>
          <br />
          <h3>Solde de la caisse {{ totalCPBalance.toFixed(2) }} €</h3>
        </v-card-text>
      </v-card>

      <v-data-table
        :headers="headers"
        :items="users"
        style="width: 100%"
        disable-pagination
        hide-default-footer
        dense
        multi-sort
        :sort-by="['firstname', 'lastname']"
      >
        <template #[`item.action`]="{ item }" style="display: flex">
          <v-text-field
            v-model="item.newConsumption"
            :label="isExpenseMode ? 'Nombre de bâton' : 'thunas (en euro)'"
            :rules="rules"
          ></v-text-field>
        </template>

        <template #[`item.balance`]="{ item }">
          {{ (item.balance || 0).toFixed(2) }} €
        </template>

        <template #[`item.newConsumption`]="{ item }">
          {{
            (
              (mode === "cask" ? stickPrice : settledStickPrice) *
                item.newConsumption || 0
            ).toFixed(2)
          }}
          €
        </template>
      </v-data-table>
    </v-container>
    <v-dialog v-model="isSwitchDialogOpen" width="600px">
      <v-card>
        <v-card-title>Attention</v-card-title>
        <v-card-text
          >Si tu change de mode les donnees non enregister seront effeace
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cleanInputs">changer de mode</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SnackNotificationContainer />
  </v-container>
</template>

<script>
/**
 * the goal of this page is to make it easier for SG to enter new consumption and count them
 * after changing a barrel the SG goes to this page and enter the coast of that barrel (totalConsumption)
 * then enter how much each user has a stick next to his name in the paper. after that the SG press a save button
 * and every user that consumed get charged accordingly
 */
import transactionRepo from "../repositories/transactionRepo";
import SnackNotificationContainer from "../components/molecules/snackNotificationContainer";
import { RepoFactory } from "~/repositories/repoFactory";

const { safeCall } = require("../utils/api/calls");

export default {
  name: "SG",
  components: { SnackNotificationContainer },

  data: () => {
    return {
      users: [],
      totalConsumption: undefined, // total coast of the barrel
      totalPrice: undefined,
      totalCPBalance: 0,
      settledStickPrice: 0.5,

      mode: "cask",

      isSwitchDialogOpen: false,

      regex: {
        int: "^[0-9]\\d*$",
        float: "^[0-9]\\d*(\\.\\d+)?$",
      },

      feedbacks: {
        totalPrice: "Prix total n' est pas un nombre",
        settledStickPrice: "Prix du baton n'est pas un nombre",
        noNewConsumption: "pas de nouvelle consomation ou de dépot",
        wrongNewConsumption: `champs non valide pour l'utilisateur: `,
      },
      reasons: [],

      headers: [
        { text: "prénom", value: "firstname" },
        { text: "nom", value: "lastname" },
        { text: "surnom", value: "nickname" },
        { text: "CP", value: "balance" },
        { text: "Nouvelle conso", value: "newConsumption" },
        { text: "action", value: "action" },
      ],
    };
  },

  computed: {
    totalConsumptions() {
      let totalConsumptions = 0;
      this.users.forEach((user) => {
        if (user.newConsumption) {
          totalConsumptions += +user.newConsumption;
        }
      });
      return totalConsumptions;
    },
    stickPrice() {
      return this.round(+this.totalPrice / +this.totalConsumptions).toFixed(2);
    },
    rules() {
      const regex = this.isExpenseMode ? this.regex.int : this.regex.float;
      return [(v) => new RegExp(regex).test(v) || `il faut mettre un entier `];
    },
    isExpenseMode() {
      return this.mode === "cask" || this.mode === "closet";
    },
    areInputsValid() {
      let res = true;
      let reason = [];

      let mUsers = this.users.filter((u) => u.newConsumption);

      if (mUsers === []) {
        res = false;
        reason.push(this.feedbacks.noNewConsumption);
      }

      switch (this.mode) {
        case "cask":
          if (!this.isFloat(this.totalPrice)) {
            res = false;
            reason.push(this.feedbacks.totalPrice);
          }
          mUsers.forEach((user) => {
            if (!this.isInteger(user.newConsumption)) {
              res = false;
              reason.push(this.feedbacks.wrongNewConsumption + user.lastname);
            }
          });
          break;

        case "closet":
          if (!this.isFloat(this.settledStickPrice)) {
            res = false;
            reason.push(this.feedbacks.settledStickPrice);
          }
          mUsers.forEach((user) => {
            if (!this.isInteger(user.newConsumption)) {
              res = false;
              reason.push(this.feedbacks.wrongNewConsumption + user.lastname);
            }
          });
          break;

        case "deposit":
          mUsers.forEach((user) => {
            if (!this.isFloat(user.newConsumption)) {
              res = false;
              reason.push(this.feedbacks.wrongNewConsumption + user.lastname);
            }
          });
          break;
      }
      return {
        res,
        reason,
      };
    },
  },

  watch: {
    mode() {
      this.isSwitchDialogOpen = true;
    },
  },

  async mounted() {
    const res = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsers(this)
    );
    if (res) {
      this.users = res.data;
    }
    this.users.forEach((user) => {
      if (user.balance) {
        this.totalCPBalance += +user.balance;
      }
    });
  },

  methods: {
    isFloat(number) {
      const floatRegex = new RegExp(this.regex.float);
      return floatRegex.test(number);
    },
    isInteger(number) {
      const floatRegex = new RegExp(this.regex.int);
      return floatRegex.test(number);
    },
    async saveTransactions() {
      let usersWithConsumptions = this.users.filter((u) => u.newConsumption);

      let isCorrect = true;

      // verify new consumptions are positive digits
      usersWithConsumptions.forEach((user) => {
        if (isNaN(user.newConsumption)) {
          isCorrect = false;
        }

        if (this.isExpenseMode) {
          // mode depense (Baton)
          try {
            if (
              user.newConsumption.includes(",") ||
              user.newConsumption.includes(".")
            ) {
              isCorrect = false;
            }
            if (+user.newConsumption < 0) {
              isCorrect = false;
            }
          } catch {
            isCorrect = false;
          }

          // verify totalPrice
          try {
            this.totalPrice = +this.totalPrice;
          } catch {
            isCorrect = false;
          }

          if (this.totalPrice === 0) {
            isCorrect = false;
          }
        }
      });

      if (!isCorrect) {
        await this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "Il faut mettre des nombre",
        });
        return;
      }

      let transactions = usersWithConsumptions.map((user) => {
        let transaction = {
          type: "expense",
          createdAt: new Date(),
          from: null,
          to: null,
        };

        switch (this.mode) {
          case "cask":
            transaction.from = user._id;
            transaction.amount = this.stickPrice * +user.newConsumption;
            transaction.context = `Conso au local de ${user.newConsumption} bâton à ${this.stickPrice} €`;
            break;

          case "closet":
            transaction.from = user._id;
            transaction.amount = +this.settledStickPrice * +user.newConsumption;
            transaction.context = `Conso placard:  ${user.newConsumption} bâtons`;
            break;

          case "deposit":
            transaction.type = "deposit";
            transaction.to = user._id;
            transaction.amount = (+user.newConsumption).toFixed(2);
            transaction.context = `Recharge de compte perso le ${new Date().toLocaleDateString()}`;
            break;
        }

        return transaction;
      });
      await transactionRepo.createTransactions(this, transactions);
      await this.$store.dispatch("notif/pushNotification", {
        type: "success",
        message: "Operations confirmées 💰💰💰",
      });

      usersWithConsumptions.forEach((u) => (u.newConsumption = ""));
    },

    cleanInputs() {
      let usersWithConsumptions = this.users.filter((u) => u.newConsumption);
      usersWithConsumptions.forEach((u) => (u.newConsumption = ""));
      this.isSwitchDialogOpen = false;
    },

    round(rawAmount) {
      const round = +(Math.round(+rawAmount * 100) / 100).toFixed(2) * 100;
      let res = parseInt(round / 5) * 5;
      return (res + 5) * 0.01;
    },
  },
};
</script>

<style scoped></style>
