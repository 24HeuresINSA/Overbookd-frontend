<template>
  <v-dialog v-model="isFormOpened" max-width="800" persistent scrollable>
    <v-card>
      <v-card-title>Ajouter un nouveau objet</v-card-title>
      <v-card-text>
        <v-btn color="primary" text @click="addEquipment">Sauvegarder</v-btn>
        <v-btn color="error" text @click="isFormOpened = false">
          Annuler
        </v-btn>
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-text-field
              v-model="item.name"
              label="Nom de l'objet"
              append-icon="mdi-search"
              single-line
              hide-details
              :rules="rules.name"
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
          <h3>Ajout de matos emprunté</h3>
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
            <v-date-picker
              v-model="newBorrow.start"
              first-day-of-week="1"
            ></v-date-picker>
            <label>fin</label>
            <v-date-picker v-model="newBorrow.end"></v-date-picker>
          </v-container>

          <v-data-table :headers="borrowedHeader" :items="item.borrowed">
            <template #[`item.action`]="{ item }">
              <v-btn icon small @click="deleteBorrowed(item)">
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
        <v-btn color="primary" @click="addEquipment"> Sauvegarder </v-btn>
        <v-btn color="error" text @click="isFormOpened = false">
          Annuler
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import _, { cloneDeep } from "lodash";

export default Vue.extend({
  name: "EquipmentDialog",
  props: {
    isNewEquipment: Boolean,
    equipment: Object,
  },
  data() {
    return {
      isFormOpened: false,

      rules: {
        name: [(v: string) => !!v || "Veuillez entrer un nom"],
        amount: [
          (v: number) => !!v || "Veuillez entrer une quantité",
          (v: number) => v >= 0 || "Veuillez entrer une quantité positive",
        ],
        location: [
          (v: string) => !!v || "Veuillez choisir un lieu de stockage",
        ],
        type: [(v: string) => !!v || "Veuillez choisir un type"],
      },
      valid: false,
      newBorrow: {
        from: "",
        amount: 0,
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
      item: {
        name: "",
        amount: 0,
        fromPool: false,
        location: "",
        preciseLocation: "",
        comment: "",
        referencePicture: "",
        referenceInvoice: "",
        type: "",
        borrowed: Array<any>(),
      },
    };
  },
  computed: {
    possibleLocations() {
      return this.$accessor.location.locations.filter((e) =>
        e.neededBy.includes("INVENTAIRE")
      );
    },
    equipmentForm() {
      return this.$accessor.config.getConfig("equipment_form");
    },
  },
  methods: {
    async addEquipment() {
      const form = this.$refs.form as HTMLFormElement;
      form.validate();
      if (!this.valid) return;
      if (this.isNewEquipment) {
        this.$accessor.equipment.set(this.item);
      } else {
        this.$accessor.equipment.update(this.item);
      }
      this.isFormOpened = false;
      form.reset();
    },
    addNewBorrowedItems() {
      this.item.borrowed.push(this.newBorrow);
      this.newBorrow = {
        from: "",
        amount: 0,
        start: "",
        end: "",
      };
    },
    deleteBorrowedProposal(item: any) {
      this.item.borrowed.splice(this.item.borrowed.indexOf(item), 1);
    },
    openDialog() {
      this.item = _.cloneDeep(this.equipment);
      this.isFormOpened = true;
    },
    getConfig(key: string): any {
      return this.$accessor.config.getConfig(key);
    },
  },
});
</script>

<style></style>