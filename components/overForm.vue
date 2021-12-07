<template>
  <div>
    <OverField
      v-for="field in fields"
      :key="field.key"
      :field="field"
      :disabled="disabled"
      :data="getData(field.key)"
      @value="onValueChange"
    >
    </OverField>
  </div>
</template>

<script lang="ts">
import OverField from "./overField.vue";
import { Field } from "../utils/models/form";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "OverForm",
  components: { OverField },
  props: {
    fields: {
      type: Array as PropType<Field[]>,
      required: true,
    },
    data: {
      type: Object,
      default: () => undefined,
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      compiledForm: {} as any,
    };
  },

  mounted() {},

  methods: {
    getData(key: any): any {
      if (this.data) {
        return this.data[key];
      }
    },
    onValueChange({ key, value }: any): any {
      this.compiledForm[key] = value;
      let isValid = true;
      this.fields.forEach((field) => {
        // check regex
        if (field.type == "string" && field.regex) {
          let r = new RegExp(field.regex);
          if (!r.test(this.compiledForm[field.key])) {
            isValid = false;
            console.log(`field not correct ${field.key}`);
          }
        }

        if (field.isRequired && this.compiledForm[field.key] === undefined) {
          isValid = false;
          console.log(
            `field not entered ${field.key} ${this.compiledForm[field.key]}`
          );
        }
      });
      this.compiledForm.isValid = isValid;
      this.$emit("form-change", this.compiledForm);
    },
  },
});
</script>

<style scoped></style>
