<template>
  <div>
    <v-text-field
        v-model="value"
        v-if="field.type=== 'string' || field.type === undefined"
        :rules="field.rule"
        :counter="field.counter"
        :label="field.label ? field.label : field.key"
        @change="onChange"
        required
    ></v-text-field>
    <v-switch
        v-model="value"
        :label="field.label ? field.label : field.key"
        v-else-if="field.type === 'switch'"
        @change="onChange"
    ></v-switch>
    <v-select
        v-else-if="field.type === 'select'"
        :label="field.label ? field.label : field.key"
        v-model="value"
        :items="field.options"
        @change="onChange"
    ></v-select>
    <v-datetime-picker
        v-if="field.type === 'datetime'"
        :label="field.label ? field.label : field.key"
        v-model="value"
        @change="onChange"
    ></v-datetime-picker>
    <div v-if="field.type === 'date'">
      <p>{{field.label ? field.label : field.key}}</p>
      <v-date-picker
          :label="field.label ? field.label : field.key"
          v-model="value"
          :active-picker.sync="activePicker"
          @change="onChange"
      ></v-date-picker>
    </div>

    <v-time-picker
        v-if="field.type == 'time'"
        :label="field.label ? field.label : field.key"
        v-model="value"
        @change="onChange"
    ></v-time-picker>
    <p v-if="field.description">{{ field.description }}</p>
  </div>
</template>

<script>
export default {
  name: "over-field",
  props: ["field"],
  data(){
    return {
      value: undefined,
      activePicker: null,
      menu: false,
    }
  },

  methods: {
    onChange(){
      this.$emit('value', {key: this.field.key, value: this.value})
    }
  },

  mounted() {
  },
}


</script>

<style scoped>

</style>