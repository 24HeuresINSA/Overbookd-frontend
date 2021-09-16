<template>
  <v-data-table
      :headers="headers"
      :items="tasks"
  >
    <template v-slot:item.action="item">
      <v-btn @click="selectUser(item)" text>sélectionner</v-btn>
    </template>

  </v-data-table>

</template>

<script>
export default {
  name: "listTasks",

  props: ['tasks'],

  data() {
    return {
      selectedTasksIndex: undefined,

      headers: [{
        text: 'FT',
        value: 'name',
      }, {
        text: 'début',
        value: 'schedule.start',
      }, {
        text: 'fin',
        value: 'schedule.end',
      }, {
        text: 'action',
        value: 'action',
      },]
    }
  },

  methods: {
    selectUser({item}) {
      console.log(item)
      this.$emit('selected-task', item);
    }
  },
}
</script>

<style scoped>

</style>