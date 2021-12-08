<template>
  <v-dialog
    v-model="changeProposalForm"
    max-width="800"
    persistent
    scrollable
    @keydown.escape="closeDialog"
  >
    <v-card>
      <v-card-title> Proposition d'un objet </v-card-title>
      <v-card-text>
        <v-form ref="proposalForm" v-model="proposalValid">
          <v-container>
            <v-text-field
              v-model="item.name"
              label="Nom de l'objet"
              append-icon="mdi-search"
              single-line
              hide-details
              :rules="rules.name"
              :disabled="!isNewEquipment"
              required
            ></v-text-field>
            <v-select
              v-model="item.type"
              required
              :items="[...equipmentForm[1].options].sort()"
              label="Catégorie/type"
              append-icon=""
              single-line
              :rules="rules.type"
            ></v-select>
            <v-text-field
              v-model="item.amount"
              label="Quantité"
              append-icon="mdi-search"
              single-line
              required
              type="number"
              :rules="rules.amount"
            ></v-text-field>

            <v-switch
              v-model="item.fromPool"
              :disabled="!isNewEquipment"
              label="Vient du pool des assos ? 🐔"
            ></v-switch>
            <v-select
              v-model="item.location"
              :items="possibleLocations"
              label="Lieux de l'objet"
              item-text="name"
              :rules="rules.location"
              single-line
            ></v-select>
            <v-text-field
              v-model="item.preciseLocation"
              label="Espace de stockage exact"
              single-line
            ></v-text-field>
            <v-text-field
              v-model="item.comment"
              label="Commentaire"
              single-line
            ></v-text-field>
            <v-text-field
              v-model="item.referencePicture"
              label="Référence photo 📷"
              single-line
            ></v-text-field>
            <v-text-field
              v-model="item.referenceInvoice"
              label="Référence facture 📃"
              single-line
            ></v-text-field>
          </v-container>
          <br />
          <v-divider></v-divider>
          <br />
          <h4>Ajout de matos emprunté</h4>
          <v-container style="display: flex; flex-wrap: wrap">
            <v-text-field v-model="newBorrow.from" label="qui"></v-text-field>
            <v-text-field
              v-model="newBorrow.amount"
              type="number"
              label="quantite"
            ></v-text-field>
          </v-container>
          <v-container
            style="
              display: flex;
              justify-content: space-around;
              align-content: baseline;
            "
          >
            <label>debut</label>
            <v-date-picker v-model="newBorrow.start"></v-date-picker>
            <label>fin</label>
            <v-date-picker v-model="newBorrow.end"></v-date-picker>
          </v-container>

          <v-data-table :headers="borrowedHeader" :items="item.borrowed">
            <template #[`item.action`]="{ item }">
              <v-btn icon small @click="deleteBorrowedProposal(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-btn fab @click="addNewBorrowedItems"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addEquipmentProposal">
          Sauvegarder
        </v-btn>
        <v-btn color="error" text @click="closeDialog"> Annuler </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from "lodash";
import Vue from "vue";
export default {
  name: "EquipmentProposalDialog",
  props: {
    equipment: Object,
    isNewEquipment: Boolean,
  },
  data() {
    return {
      changeProposalForm: false,
      proposalValid: false,
      rules: {
        name: [(v) => !!v || "Veuillez entrer un nom"],
        amount: [
          (v) => !!v || "Veuillez entrer une quantité",
          (v) => v >= 0 || "Veuillez entrer une quantité positive",
        ],
        location: [(v) => !!v || "Veuillez choisir un lieu de stockage"],
        type: [(v) => !!v || "Veuillez choisir un type"],
      },
      newBorrow: {
        from: "",
        amount: "",
        start: "",
        end: "",
      },
      borrowedHeader: [
        {
          text: "qui",
          align: "left",
          value: "from",
        },
        {
          text: "quantite",
          align: "left",
          value: "amount",
        },
        {
          text: "debut",
          align: "left",
          value: "start",
        },
        {
          text: "fin",
          align: "left",
          value: "end",
        },
        {
          text: "",
          align: "right",
          value: "action",
        },
      ],
      borrowedProposal: [],
      item: _.cloneDeep(this.equipment),
    };
  },
  computed: {
    possibleLocations() {
      return this.$accessor.location.locations.filter((e) =>
        e.neededBy.includes("INVENTAIRE")
      );
    },
    equipmentForm() {
      return this.getConfig("equipment_form");
    },
  },
  mounted() {},
  methods: {
    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
    addEquipmentProposal() {
      const form = this.$refs.proposalForm;
      form.validate();
      if (this.isNewEquipment) {
        this.item.isNewEquipment = this.isNewEquipment;
      } else {
        this.item.isNewEquipment = this.isNewEquipment;
        this.item.oldEquipment = this.item._id;
        delete this.item._id;
      }
      if (!this.proposalValid) return;
      this.$store.dispatch(
        "equipmentProposal/createEquipmentProposal",
        this.item
      );
      this.changeProposalForm = false;
      form.reset();
    },
    addNewBorrowedItems() {
      this.item.borrowed.push(this.newBorrow);
      this.newBorrow = {
        from: "",
        amount: "",
        start: "",
        end: "",
      };
    },
    deleteBorrowedProposal(item) {
      this.item.borrowed.splice(this.item.borrowed.indexOf(item), 1);
    },
    openDialog() {
      if (this.isNewEquipment) {
        this.item = {
          name: "",
          amount: "",
          location: "",
          type: "",
          comment: "",
          referencePicture: "",
          referenceInvoice: "",
          borrowed: [],
        };
      } else {
        this.item = _.cloneDeep(this.equipment);
      }
      Vue.nextTick(() => {
        this.changeProposalForm = true;
      });
    },
    closeDialog() {
      this.changeProposalForm = false;
      this.$refs.proposalForm.reset();
    },
  },
};
</script>

<style></style>
