<template>
  <v-container
    style="
      left: 0;
      max-width: none;
      margin-left: 0;
      margin-right: 0;
      position: absolute;
      display: flex;
      height: 100%;
      width: 100%;
    "
  >
    <filtered-users @selected-user="onSelectedUser" style="max-width: 350px"></filtered-users>

    <!-- calendar --->
    <over-calendar :events="selectedUser ? selectedUser.assigned : []"></over-calendar>

    <over-tasks :user="selectedUser" @add-task="addTask"></over-tasks>

    <!--    <v-btn-->
    <!--        fab-->
    <!--        v-if="getSelectedUser"-->
    <!--        @click="saveAssignment"-->
    <!--        style="position: fixed; right: 20px; bottom: 40px; z-index: 20"-->
    <!--    >-->
    <!--      <v-icon>mdi-content-save</v-icon>-->
    <!--    </v-btn>-->

    <v-snackbar v-model="isFeedbackSnackbarOpen" :timeout="5000"
    >Sauvgarder 🥳
    </v-snackbar
    >


  </v-container>
</template>

<script>
import {getConfig, hasRole} from "../common/role";
import Fuse from "fuse.js";
import OverChips from "../components/overChips";
import FilteredUsers from "../components/filtredUsers";
import OverTasks from "../components/overTasks";
import OverCalendar from "../components/overCalendar";

export default {
  name: "assignment",
  components: {OverCalendar, OverTasks, FilteredUsers, OverChips},
  data() {
    return {
      selectedUserFriend: undefined,
      selectedUser: undefined,
      selectedDay: undefined,
      selectedTimeframe: undefined,
      FTs: [],
      updatedFTs: [],
      isFeedbackSnackbarOpen: false,
      isInfoDisplayed: false,
      isNewEventDialogOpen: false,
      isAssignmentUpdated: true,
      newEventName: undefined,
      filters: {
        name: undefined,
        teams: [],
      },
      events: [],
      teams: this.getConfig("teams"),
      timeframes: this.getConfig("timeframes"),
    };
  },

  async mounted() {
    if (!hasRole(this, "hard")) {
      alert("vous avez pas le role 'hard' pour acceder a cette page");
      await this.$router.push({
        path: "/",
      });
    }
    // user has access to this page
  },

  methods: {
    addTask(timeframe) {
      if (!this.selectedUser.assigned) {
        this.selectedUser.assigned = [];
      }
      this.selectedUser.assigned.push({
        name: timeframe.name,
        FTID: timeframe.FTID,
        schedule: {
          start: timeframe.start,
          end: timeframe.end,
        }
      })
    },

    getConfig(key) {
      return getConfig(this, key);
    },

    onSelectedUser(user) {
      this.selectedUser = user;
    },

    // getCalendarFormattedAssignedFTsOfSelectedUser() {
    //   let events = [];
    //   if (this.getSelectedUser && this.getSelectedUser.assigned !== undefined) {
    //     let assignedFTs = this.getSelectedUser.assigned;
    //     assignedFTs.forEach((assignedFT) => {
    //       if (assignedFT.schedule) {
    //         let start = new Date(
    //             Date.parse(
    //                 assignedFT.schedule.date + " " + assignedFT.schedule.start
    //             )
    //         );
    //         let end = new Date(
    //             Date.parse(assignedFT.schedule.date + " " + assignedFT.schedule.end)
    //         );
    //
    //         // add to calendar
    //         events.push({
    //           name: assignedFT.name,
    //           start,
    //           end,
    //           color: "#ebc034",
    //         });
    //       }
    //     });
    //   }
    //   return events;
    // },

    // async saveAssignment() {
    //   // save FT
    //   await this.$axios.put(`/user/${this.getSelectedUser.keycloakID}`, {
    //     assigned: this.getSelectedUser.assigned,
    //   });
    //   this.isFeedbackSnackbarOpen = true;
    // },
  },

  computed: {
    selectedUserAvailabilities() {
      let events = [];
      if (this.getSelectedUser && this.getSelectedUser.availabilities) {
        let mAvailabilities = this.getSelectedUser.availabilities;
        if (mAvailabilities.length !== 0) {
          mAvailabilities.forEach((reason) => {
            if (reason.days) {
              reason.days.forEach((day) => {
                if (day.frames) {
                  day.frames.forEach((frame) => {
                    let timeframe = {
                      start: new Date(Date.parse(day.date + " " + frame.start)),
                      end: new Date(Date.parse(day.date + " " + frame.end)),
                    };
                    events.push({
                      name: "Disponible",
                      start: this.getStupidAmericanTimeFormat(timeframe.start),
                      end: this.getStupidAmericanTimeFormat(timeframe.end),
                      color: "rgba(222,121,226,0.45)",
                    });
                  });
                }
              });
            }
          });
        }
      }
      // add assigned events
      const assignedEvents =
        this.getCalendarFormattedAssignedFTsOfSelectedUser();
      events = events.concat(assignedEvents);
      return events;
    },
  },

  watch: {
    selectedTimeframe() {
      const selectedDayTimestamp = this.timeframes.find(e => e.name === this.selectedTimeframe)
      if (selectedDayTimestamp) {
        this.selectedDay = selectedDayTimestamp.day;
      }
    },

    selectedAssignments() {
      // selected assignment changed...
      // let user = this.getSelectedUser;
      // this.$set(user, "assigned", this.selectedAssignments);
    },

    filters: {
      deep: true,

      handler() {
        const filters = this.filters;
        let users = this.users;

        // filter by name
        if (filters.name) {
          const options = {
            // Search in `author` and in `tags` array
            keys: ["firstname", "lastname", 'nickname'],
          };
          const fuse = new Fuse(users, options);

          users = fuse.search(filters.name).map((e) => e.item);
        }

        // filter by team
        if (filters.teams.length !== 0) {
          users = users.filter((user) => {
            if (user.team && user.team.length !== 0) {
              let all = true;
              filters.teams.forEach((t) => {
                all = all && user.team.includes(t);
              });
              return all;
            }
            return false;
          });
        }
        this.filteredUsers = users;
        this.sortFilteredUsers();

      },
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0;
}
</style>
