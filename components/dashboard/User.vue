<template>
  <div class="userCard">
    <v-col cols="9">
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          {{ userName }}
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-email</v-icon>
          </v-list-item-icon>
          {{ user.email }}
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-phone</v-icon>
          </v-list-item-icon>
          {{ user.phoneNumber }}
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-cake</v-icon>
          </v-list-item-icon>
          {{ user.birthday }}
        </v-list-item>
        <v-list-item v-if="specialty">
          <v-list-item-icon>
            <v-icon>mdi-account-hard-hat</v-icon>
          </v-list-item-icon>
          {{ specialty.year + " " + specialty.name }}
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="3">
      <v-img :src="user.profilePicURL" />
    </v-col>
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "User",
  computed: {
    userName: function () {
      return this.user.firstName + " " + this.user.lastName;
    },
    birthday: function () {
      return moment(this.user.birthday).format("lll");
    },
    specialty: function () {
      return this.specialties.find((s) => s.id === this.user.id);
    },
    ...mapState({
      user: (state) => state.user.user,
      specialties: (state) => state.specialty.content,
    }),
  },
  async beforeCreate() {
    await this.$store.dispatch("specialty/getSpecialties");
  },
};
</script>

<style lang="scss" scoped>
.userCard {
  display: flex;

  width: 100%;
}
</style>
