<template>
  <div>
    <EquipmentProposalDialogPage
      ref="equipPropPage"
    ></EquipmentProposalDialogPage>

    <v-container>
      <v-row>
        <v-col md="3">
          <v-card>
            <v-card-title>
              <span class="headline">Filtres</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search.name"
                label="Nom de l'objet"
                append-icon="mdi-search"
                single-line
                hide-details
              ></v-text-field>
              <v-select
                v-model="search.type"
                :items="selectOptions"
                label="Catégorie/type"
                append-icon=""
                single-line
                hide-details
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="clear"> Clear </v-btn>
            </v-card-actions>
          </v-card>
          <br />
          <v-card>
            <v-card-title>
              <span class="headline">Lieux</span>
            </v-card-title>
            <v-card-text>
              <location-adder ref="locationAdder"></location-adder>
              <v-chip-group
                v-model="search.location"
                column
                multiple
                active-class="primary--text"
              >
                <v-chip
                  v-for="location in possibleLocations"
                  :key="location._id"
                  :value="location.name"
                  >{{ location.name }}</v-chip
                >
              </v-chip-group>
              <v-chip-group class="mt-3" column multiple>
                <v-chip
                  v-for="location in signaLocations"
                  :key="location._id"
                  :value="location.name"
                  disabled
                  >{{ location.name }}</v-chip
                >
              </v-chip-group>
            </v-card-text>
            <v-card-actions v-if="hasRole(['log'])">
              <v-btn
                color="primary"
                text
                @click="$refs.locationAdder.openDialog()"
                >Ajouter</v-btn
              >
              <!-- <v-btn color="primary" text @click="tryDeleteLocation()"
                >Supprimer</v-btn
              > -->
            </v-card-actions>
          </v-card>
          <br />
          <v-card>
            <v-btn @click="openProposalPage()"> open dialog </v-btn>
          </v-card>
        </v-col>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="filteredInventory"
            group-by="type"
            :item-class="rowClass"
            dense
            :items-per-page="-1"
            :loading="loading"
          >
            <template #[`item.action`]="{ item }">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon small @click="showItemInfos(item)" v-on="on">
                    <v-icon small>mdi-help-circle</v-icon>
                  </v-btn>
                </template>
                Afficher les informations de l'objet44
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon small @click="itemChangeProposal(item)" v-on="on">
                    <v-icon small>mdi-book-edit-outline </v-icon>
                  </v-btn>
                </template>
                Propose des changements sur l'objet (et voit ses infos)
              </v-tooltip>
              <v-btn v-if="hasRole('log')" icon small @click="edit(item)">
                <v-icon small>mdi-circle-edit-outline</v-icon>
              </v-btn>
              <v-btn v-if="hasRole('log')" icon small @click="deleteItem(item)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>

            <template #[`item.borrow`]="{ item }">
              <!-- Divs get better style, and list not that needed -->
              <div v-for="(borrow, index) of item.borrowed" :key="index">
                {{ borrow.amount }} {{ borrow.from }}
              </div>
            </template>
            <template #[`group.header`]="{ group, headers, toggle, isOpen }">
              <td :colspan="headers.length" class="primary">
                <v-btn
                  :ref="group"
                  small
                  icon
                  :data-open="isOpen"
                  @click="toggle"
                >
                  <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                  <v-icon v-else>mdi-chevron-down</v-icon>
                </v-btn>
                <span class="mx-5 font-weight-bold">{{ group }}</span>
              </td>
            </template>
            <template #[`item.borrowedCount`]="{ item }">
              {{ getBorrowedCount(item) }}
            </template>

            <template #[`item.totalCount`]="{ item }">
              {{ +getBorrowedCount(item) + +item.amount }}
            </template>
            <template #[`item.fromPool`]="{ item }">
              <span v-if="item.fromPool"> 🐔 </span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      v-if="hasRole(allowedTeams)"
      fab
      style="right: 20px; bottom: 45px; position: fixed"
      @click="newEquip()"
    >
      <v-icon> mdi-plus </v-icon>
    </v-btn>
    <v-btn
      fab
      style="right: 80px; bottom: 45px; position: fixed"
      @click="newProposal()"
    >
      <v-icon>mdi-clipboard-edit-outline</v-icon>
    </v-btn>

    <EquipmentProposalDialog
      ref="propDialog"
      :equipment="selectedItem"
      :is-new-equipment="isNewEquipment"
    ></EquipmentProposalDialog>

    <EquipmentDialog
      ref="equipDialog"
      :equipment="selectedItem"
      :is-new-equipment="isNewEquipment"
    ></EquipmentDialog>
    <v-dialog v-model="isPreciseLocDialog" max-width="800">
      <v-card>
        <v-card-title>Emplacement précis</v-card-title>
        <v-card-text v-if="selectedItem.preciseLocation">
          <b>{{ selectedItem.preciseLocation }}</b>
        </v-card-text>
        <v-alert v-else color="error">
          Aucun emplacement précis n'a été défini
        </v-alert>
      </v-card>
    </v-dialog>
    <EquipmentInformations
      ref="equipmentInformationsDialog"
      :equipment="selectedItem"
    ></EquipmentInformations>
  </div>
</template>

<script>
import OverForm from "../components/overForm";
import locationAdder from "../components/organisms/locationAdder";
import { safeCall } from "../utils/api/calls";
import { RepoFactory } from "../repositories/repoFactory";
import { cloneDeep, isEqual } from "lodash";
import Vue from "vue";
import LocationAdder from "~/components/organisms/locationAdder.vue";
import EquipmentInformations from "~/components/organisms/EquipmentInformations.vue";
import EquipmentProposalDialog from "~/components/organisms/EquipmentProposalDialog.vue";
import EquipmentProposalDialogPage from "~/components/organisms/EquipmentProposalDialogPage.vue";
import EquipmentDialog from "~/components/organisms/EquipmentDialog.vue";

export default {
  name: "Inventory",
  components: {
    locationAdder,
    EquipmentInformations,
    EquipmentProposalDialog,
    EquipmentProposalDialogPage,
    EquipmentDialog,
  },
  data() {
    return {
      headers: [
        { text: "nom", value: "name" },
        { text: "lieu de stockage", value: "location" },
        { text: "quantite (inventaire 24)", value: "amount", align: "right" },
        { text: "quantite (emprunté)", value: "borrowedCount", align: "right" },
        { text: "emprunté", value: "borrow" },
        { text: "Poule", value: "fromPool" },
        { text: "quantite total", value: "totalCount", align: "right" },
        { text: "requis", value: "required.count", align: "right" },
        { text: "action", value: "action", align: "right" },
      ],
      borrowedHeader: [
        { text: "qui", value: "from" },
        { text: "quantite", value: "amount" },
        { text: "debut", value: "start" },
        { text: "fin", value: "end" },
        { text: "action", value: "action" },
      ],
      borrowed: [],
      isFormOpened: false,
      changeProposalForm: false,
      allowedTeams: ["log"],
      selectedItem: {},
      search: {
        name: "",
        location: [],
        locationSigna: [],
        type: "",
      },
      selectOptions: [],
      newLocation: "",
      isPreciseLocDialog: false,
      valid: false,

      isNewEquipment: false,
      loading: false,
    };
  },

  computed: {
    me: () => this.$store.state.user.me,
    filteredInventory() {
      return this.inventory.filter((item) => {
        return (
          item.name.toLowerCase().includes(this.search.name.toLowerCase()) &&
          (this.search.location.length === 0 ||
            this.search.location.includes(item.location)) &&
          item.type.toLowerCase().includes(this.search.type.toLowerCase())
        );
      });
    },
    possibleLocations() {
      return this.$accessor.location.locations.filter((e) =>
        e.neededBy.includes("INVENTAIRE")
      );
    },
    signaLocations() {
      return this.$accessor.location.signa;
    },
    equipmentForm() {
      return this.getConfig("equipment_form");
    },
    inventory() {
      return cloneDeep(this.$accessor.equipment.items);
    },
  },

  async mounted() {
    // setup config
    this.loading = true;
    const res = await this.$accessor.location.getAllLocations();
    if (!res) {
      // todo display snackbar notif
      console.log("Error, could not fetch the DB");
    }
    this.allowedTeams = (await this.getConfig(this, "isInventoryOpen"))
      ? ["log", "hard"]
      : ["log"];
    this.selectOptions = this.equipmentForm[1].options;
    await this.$accessor.equipment.fetchAll();
    const FTs = await safeCall(this.$store, RepoFactory.ftRepo.getAllFTs(this));
    const FAs = await safeCall(this.$store, RepoFactory.faRepo.getAllFAs(this));

    const Form = FAs.data.concat(FTs.data);

    this.inventory.forEach((item) => {
      item.required = {
        count: 0,
        form: [],
      };
      Form.forEach((form) => {
        if (form.equipments && form.isValid !== false) {
          const mEquipment = form.equipments.find((e) => e._id === item._id);
          if (mEquipment) {
            item.required.count += mEquipment.required;
            item.required.form.push(form);
          }
        }
      });
    });
    this.loading = false;
  },

  methods: {
    rowClass(item) {
      if (item.required) {
        let isNegatif =
          item.required.count > +this.getBorrowedCount(item) + +item.amount;
        return isNegatif ? "color: red" : "";
      }
    },

    hasRole(role) {
      return this.$accessor.user.hasRole(role);
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    onFormChange(form) {
      console.log(form);
      // because it doesn't work ...
      form.isValid = true;
      Object.assign(this.selectedItem, form);
    },

    openDialog() {
      this.selectedItem = {};
      this.isFormOpened = true;
    },

    openProposalPage() {
      this.$refs.equipPropPage.openDialog();
    },
    getBorrowedCount(item) {
      let count = 0;
      if (item && item.borrowed) {
        if (item.borrowed.length) {
          item.borrowed.forEach((b) => {
            if (b.amount) {
              count = count + +b.amount;
            }
          });
        }
      }
      return count;
    },

    edit(item) {
      this.selectedItem = item;
      Vue.nextTick(() => {
        this.$refs.equipDialog.openDialog();
      });
    },
    async itemChangeProposal(item) {
      this.selectedItem = item;
      console.log(this.selectedItem);
      this.isNewEquipment = false;
      await Vue.nextTick();
      this.$refs.propDialog.openDialog();
    },
    newEquip() {
      this.selectedItem = {};
      this.isNewEquipment = true;
      this.$refs.equipDialog.openDialog();
    },
    newProposal() {
      this.selectedItem = {};
      this.isNewEquipment = true;
      this.$refs.propDialog.openDialog();
    },
    async deleteItem(item) {
      if (item.required && item.required.count > 0) {
        //TODO: Create this snackbar/toast for global use
        this.$store.commit("setSnackbar", {
          text: "Impossible de supprimer un équipement qui est requis",
          color: "error",
        });
        return;
      }
      this.$accessor.equipment.delete(item);
    },
    clear() {
      this.search = {
        name: "",
        location: "",
        type: "",
      };
    },
    async tryDeleteLocation() {
      const index = this.equipmentForm.findIndex((e) => e.key === "location");
      //TODO add a notification to know why you can't delete
      if (this.inventory.some((e) => this.search.location.includes(e.location)))
        return;
      const newEquipmentForm = cloneDeep(this.equipmentForm);
      newEquipmentForm[index].options = newEquipmentForm[index].options.filter(
        (e) => !this.search.location.includes(e)
      );
      this.$store.dispatch("config/setConfig", {
        key: "equipment_form",
        value: newEquipmentForm,
      });
      this.$forceUpdate();
    },
    async showItemInfos(item) {
      this.selectedItem = item;
      await Vue.nextTick();
      this.$refs.equipmentInformationsDialog.openDialog();
    },
    async deleteBorrowed(item) {
      const index = this.selectedItem.borrowed.findIndex((e) =>
        isEqual(e, item)
      );
      this.selectedItem.borrowed.splice(index, 1);
      //await this.$axios.put("/equipment", this.selectedItem);
    },
  },
};
</script>

<style scoped>
/* .v-list-item {
  padding: 0;
}

.v-list-item__content {
  padding: 0;
} */
</style>
