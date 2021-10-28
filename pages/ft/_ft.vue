<template>
  <div>
    <v-container
      style="
        display: flex;
        align-content: center;
        justify-content: space-between;
      "
    >
      <h1>Fiche Tache 🤩</h1>
      <h2>{{ FT ? FT.status : "draft" }}</h2>
    </v-container>

    <br />
    <FormCard
      title="Général"
      topic="general"
      form-key="ft_general_form"
      :form="FT"
      @form-change="updateForm('general', $event)"
    ></FormCard>

    <br />
    <FormCard
      title="Détail"
      topic="details"
      form-key="ft_details_form"
      :form="FT"
      @form-change="updateForm('details', $event)"
    ></FormCard>

    <br />
    <CompleteTimeframeCard :store="store"></CompleteTimeframeCard>

    <br />
    <LogisticsCard title="Matos" type="petit" :store="store"></LogisticsCard>

    <v-dialog v-model="isRefusedDialogOpen">
      <v-card>
        <v-card-title>Refuser la FT</v-card-title>
        <v-card-text>
          <v-textarea v-model="refusedComment"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="refuse">refuse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isSubmitDialogOpen" width="600px">
      <v-card>
        <v-img src="img/memes/submit_FT.gif" height="300px"></v-img>
        <v-card-title>t'es sur de ta FT ?</v-card-title>
        <v-card-actions>
          <v-btn text @click="isSubmitDialogOpen = false">Non</v-btn>
          <v-btn text @click="submitForReview">je suis sûr</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbarOpen" :timeout="5000"
      >{{ snackbarMessage }}
    </v-snackbar>

    <div style="height: 50px; width: 100%"></div>

    <div
      style="
        display: flex;
        justify-content: space-evenly;
        position: sticky;
        bottom: 20px;
        z-index: 30;
      "
    >
      <v-btn v-if="getValidator()" color="green" @click="validateFT"
        >validé
      </v-btn>
      <v-btn
        v-if="getValidator()"
        color="red"
        @click="isRefusedDialogOpen = true"
        >refusé
      </v-btn>
      <v-btn color="secondary" @click="isSubmitDialogOpen = true"
        >Soumettre a validation</v-btn
      >
      <v-btn color="warning" @click="saveFT">sauvgarder</v-btn>
    </div>
  </div>
</template>

<script>
import { RepoFactory } from "~/repositories/repoFactory";
import FormCard from "../../components/organisms/form/FormCard";
import LogisticsCard from "../../components/organisms/form/LogisticsCard";
import CompleteTimeframeCard from "../../components/organisms/form/CompleteTimeframeCard";

export default {
  name: "Ft",
  components: { CompleteTimeframeCard, LogisticsCard, FormCard },
  data() {
    return {
      FTID: +this.$route.params.ft, // count
      FT_FORM: this.getConfig("ft_form"),
      FT_VALIDATORS: this.getConfig("ft_validators"),
      FTRepo: RepoFactory.ftRepo,
      store: undefined, // FT store
      schedules: [],
      refusedComment: undefined,
      isRefusedDialogOpen: false,
      isSubmitDialogOpen: false,
      isSnackbarOpen: false,
      isAssignmentDialogOpen: false,
      selectedTimeframeIndex: undefined,
      assignedRole: undefined,
      assignedAmount: undefined,
      assignedHuman: undefined,
      usernames: [],
      requiredHumans: [],
      snackbarMessage: "",
      feedbacks: {
        validate: "FT valide ",
        refused: "FT refuse  🥺",
        save: "FT sauvgarde",
        submitted: "FT soumise a validation 🥵 may the odds be with you",
      },
      schedule: {
        date: undefined,
        start: undefined,
        end: undefined,
      },

      isEquipmentDialogOpen: false,
      equipmentsHeader: [
        { text: "item", value: "name" },
        { text: "selectionné", value: "selectedAmount" },
      ],

      selectedEquipment: [],
      availableEquipment: [],
    };
  },

  computed: {
    FT: function () {
      return this.$accessor.FT.mFT;
    },
    me: function () {
      return this.$accessor.user.me;
    },
  },

  async mounted() {
    // get FT and store it in store
    this.store = this.$accessor.FT;
    await this.store.getAndSetFT(this.FTID);
    console.log(this.getValidator());
  },

  methods: {
    saveRequiredHuman() {
      this.$set(
        this.FT.schedules[this.selectedTimeframeIndex],
        "needs",
        this.requiredHumans
      );
      this.isAssignmentDialogOpen = false;
      console.log(this.FT.schedules);
    },

    addHuman() {
      this.requiredHumans.push(this.assignedHuman);
    },

    addRole() {
      this.requiredHumans.push({
        role: this.assignedRole,
        amount: this.assignedAmount,
      });
    },

    openAssignmentDialog(timeframeIndex) {
      this.selectedTimeframeIndex = timeframeIndex;
      this.requiredHumans = this.FT.schedules[timeframeIndex].needs
        ? this.FT.schedules[timeframeIndex].needs
        : [];
      this.isAssignmentDialogOpen = true;
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    hasRole(role) {
      return this.me.team.includes(role);
    },

    getValidator() {
      let mValidator = null;
      this.FT_VALIDATORS.forEach((validator) => {
        if (this.hasRole(validator)) {
          mValidator = validator;
        }
      });
      return mValidator;
    },

    async saveFT() {
      await this.store.saveFT();
    },

    updateForm(section, form) {
      let newForm = {};
      newForm[section] = form;
      this.store.assignFT(newForm);
    },

    validateFT() {
      const validator = this.getValidator();

      this.store.validate(validator);

      this.snackbarMessage = this.feedbacks.validate;
      this.isSnackbarOpen = true;
    },

    submitForReview() {
      this.store.submitForReview();
      this.snackbarMessage = this.feedbacks.submitted;
      this.isSnackbarOpen = true;
      this.isSubmitDialogOpen = false;
    },

    refuse() {
      this.FT.status = "refused";
      const validator = this.getValidator();
      if (this.FT.refused === undefined) {
        this.FT.refused = [];
      }
      this.FT.refused.push(validator);
      this.snackbarMessage = this.feedbacks.refused;
      this.isSnackbarOpen = true;
      this.isRefusedDialogOpen = false;
      this.saveFT();
    },
  },
};
</script>

<style scoped></style>
