<template>
  <div class="teamList">
    <v-list-item v-for="t in teams" :key="t.id" class="teamListItem">
      <v-list-item-content>
        <v-card class="teamCard" flat outlined hover>
          <div class="teamTitle">{{ t.title }}</div>
        </v-card>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Teams",
  computed: {
    ...mapState({
      teams: (state) => state.user.user.teams,
    }),
  },
};
</script>

<style lang="scss" scoped>
.teamCard {
  padding: 15px 5px;
}
.teamCard:hover {
  background: #eee;
}
.teamTitle {
  display: flex;
  justify-content: center;
}
.teamListItem {
  max-width: 20%;
}
.teamList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
