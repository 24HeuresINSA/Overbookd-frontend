<template>
  <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <OverForm
        :fields="FORM"
        :disabled="isDisabled"
        @form-change="onFormChange"
      ></OverForm>
    </v-card-text>
  </v-card>
</template>

<script>
import OverForm from "../../overForm";

export default {
  name: "FormCard",
  components: { OverForm },
  props: {
    title: {
      type: String,
      default: () => {
        "";
      },
    },
    formKey: {
      type: String,
      default: () => {
        null;
      },
    },
    isDisabled: {
      type: Boolean,
      default: () => {
        false;
      },
    },
  },
  data: () => {
    return {
      FORM: undefined,
    };
  },
  mounted() {
    this.FORM = this.$accessor.config.getConfig(this.formKey);
  },
  methods: {
    onFormChange(form) {
      this.$emit("form-change", form);
    },
  },
};
</script>

<style scoped></style>
