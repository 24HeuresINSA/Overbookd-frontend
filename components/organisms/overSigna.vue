<template>
  <div>
    <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
      <v-card-title>Signa</v-card-title>
      <v-card-subtitle
        >Contacter la signa à signalitique@24heures.org pour ajouter des lieux
        non existant dans la liste deroulante
      </v-card-subtitle>
      <v-card-text>
        <v-autocomplete
          label="Lieux"
          multiple
          :value="locations"
          :disabled="isDisabled"
          @change="updateLocations"
        ></v-autocomplete>
        <v-switch v-model="isSignaRequired" label="Besoin signa"></v-switch>
        <div v-if="isSignaRequired">
          <v-data-table :headers="headers" :items="signalisation">
            <template #[`item.action`]="{ index }">
              <v-btn
                :disabled="isDisabled"
                icon
                @click="deleteSignalisation(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <template #[`item.number`]="{ index, item }">
              <v-text-field
                :value="item.number"
                label="Nombre"
                type="number"
                min="0"
                step="1"
                :disabled="isDisabled"
                @change="onItemChange($event, index)"
              ></v-text-field>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
      <v-card-actions v-if="isSignaRequired && !isDisabled">
        <v-spacer></v-spacer>
        <v-btn text @click="isSignaFormOpen = true"
          >Ajouter une signalisation
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isSignaFormOpen" max-width="600">
      <v-card>
        <v-card-title>Ajouter une signalisation</v-card-title>
        <v-card-text>
          <OverForm :fields="fields" @form-change="onFormChange"></OverForm>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isSignaFormOpen = false"
            >Annuler</v-btn
          >
          <v-btn color="blue darken-1" text @click="onFormSubmit"
            >Valider</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import OverForm from "../overForm.vue";
import Vue from "vue";
import { Signalisation } from "~/utils/models/FA";
import { Field } from "../../utils/models/form";

interface Data {
  isSignaRequired: boolean;
  isSignaFormOpen: boolean;
  newSignalisation: undefined | Signalisation;
  fields: Field[];
  //todo: specify below
  headers: Array<Object>;
}

export default Vue.extend({
  name: "OverSigna",
  components: { OverForm },
  props: {
    /**
     * Define if this is editable or not
     */
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data(): Data {
    return {
      isSignaRequired: false,
      isSignaFormOpen: false,

      headers: [
        { text: "nombre", value: "number" },
        { text: "type", value: "type" },
        { text: "texte à afficher", value: "text" },
        { text: "commentaire", value: "comment" },
        { text: "", value: "action" },
      ],

      fields: [],
      newSignalisation: undefined,
    };
  },
  computed: {
    signalisation(): Signalisation[] {
      return this.$accessor.FA.mFA.signalisation;
    },
    locations() {
      return this.$accessor.FA.mFA.details.locations;
    },
  },
  watch: {
    signalisation: {
      handler() {
        if (this.signalisation.length > 0) {
          this.isSignaRequired = true;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.fields =
      this.$accessor.config.getConfig("fa_signalisation_form") || [];
  },
  methods: {
    onFormChange(form: any) {
      this.newSignalisation = form;
    },
    onFormSubmit() {
      if (this.newSignalisation) {
        this.$accessor.FA.addSignalisation(this.newSignalisation);
        this.isSignaFormOpen = false;
      }
    },
    deleteSignalisation(index: number) {
      this.$accessor.FA.deleteSignalisation(index);
    },
    onItemChange(num: number, index: number) {
      this.$accessor.FA.updateSignalisationNumber({ index, num });
    },
  },
});
</script>

<style scoped></style>
