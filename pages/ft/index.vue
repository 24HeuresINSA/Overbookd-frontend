<template>
  <div>
    <h1>Fiche Tache 👻</h1>

    <v-container>
      <v-row>
        <v-col md="2">
          <v-card>
            <v-card-title>Filtres</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="filters.search"
                label="recherche"
              ></v-text-field>
              <v-select
                v-model="filters.teams"
                label="Équipe"
                :items="getConfig('teams').map((e) => e.name)"
                clearable
                dense
              ></v-select>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="10">
          <v-data-table :headers="headers" :items="FTs">
            <template #[`item.status`]="row">
              <v-avatar size="25" :color="color[row.item.status]">
                {{ row.item.count }}
              </v-avatar>
            </template>
            <template #[`item.action`]="row">
              <v-btn
                style="margin: 5px"
                icon
                small
                :href="'/ft/' + row.item.count"
              >
                <v-icon small>mdi-link</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                @click="
                  mFT = row.item;
                  isDialogOpen = true;
                "
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <v-btn
      color="secondary"
      elevation="2"
      fab
      class="fab-right"
      @click="createNewFT"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isDialogOpen" width="600">
      <v-card>
        <v-img src="sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="deleteFT()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { safeCall } from "~/utils/api/calls";
import ftRepo from "../../repositories/ftRepo";
import { Header } from "~/utils/models/Data";
import Vue from "vue";
import { FT } from "~/utils/models/FT";

interface Data {
  color: { [key: string]: string };
  headers: Header[];
  FTs: any[];
  mFT: any;
  isDialogOpen: boolean;

  filters: {
    search: string;
    teams: string;
  };
}

const color = {
  undefined: "grey",
  draft: "grey",
  submitted: "orange",
  validated: "green",
  refused: "red",
};

export default Vue.extend({
  name: "Index",
  data(): Data {
    return {
      color,
      headers: [
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Nom",
          value: "general.name",
        },
        {
          text: "Resp",
          value: "general.inCharge.username",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
      FTs: [],
      filters: {
        search: "",
        teams: "",
      },
      mFT: undefined,
      isDialogOpen: false,
    };
  },

  async mounted() {
    if (this.hasRole("hard")) {
      const res = await safeCall(this.$store, ftRepo.getAllFTs(this));
      if (res) {
        this.FTs = res.data.data; // includes deleted FTs
      }
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    hasRole(role: string) {
      return this.$accessor.user.hasRole(role);
    },

    getConfig(key: string) {
      return this.$accessor.config.getConfig(key);
    },

    async createNewFT() {
      const blankFT: FT = {
        FA: 0,
        general: {
          name: "",
        },
        status: "draft",
        validated: [],
        refused: [],
        equipments: [],
        timeframes: [],
        _id: "",
        count: 0,
        details: {},
        comments: [],
      };
      let res = await safeCall(
        this.$store,
        ftRepo.createFT(this, blankFT),
        "FT 🥳"
      );
      if (res) {
        await this.$router.push({
          path: "/ft/" + res.data.count,
        });
      }
    },

    async deleteFT() {
      await safeCall(this.$store, ftRepo.deleteFT(this, this.mFT), "FT del");
      this.FTs = this.FTs.filter((ft) => ft.count !== this.mFT.count);
      this.isDialogOpen = false;
    },
  },
});
</script>

<style scoped></style>
