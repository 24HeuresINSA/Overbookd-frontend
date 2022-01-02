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
    <FilteredUsers
      style="max-width: 350px"
      @selected-user="onSelectedUser"
    ></FilteredUsers>

    <!-- calendar --->
    <OverCalendar
      :center-day="new Date().setDate(new Date().getDate() - 5)"
      :events="calendarDisplayedEvents"
      :available="userAvailabilities"
      @delete-assignment="unassign"
    ></OverCalendar>

    <OverTasks
      :user="selectedUser"
      style="max-width: 550px"
      @add-task="addTask"
    ></OverTasks>
  </v-container>
</template>

<script lang="ts">
import ftRepo from "../repositories/ftRepo";
import { safeCall } from "../utils/api/calls";
import Vue from "vue";
import FilteredUsers from "~/components/filtredUsers.vue";
import OverCalendar from "~/components/overCalendar.vue";
import OverTasks from "~/components/overTasks.vue";
import { User } from "~/utils/models/repo";
import { Timeframe } from "~/utils/models/timeframe";
import { FT } from "~/utils/models/FT";

interface Data {
  timeslots: any[];
  selectedUser: User | undefined;
  selectedDate: Date | undefined;
  selectedDay: Date | undefined;
  selectedTimeframe: string | undefined;

  isFeedbackSnackbarOpen: boolean;
  isInfoDisplayed: boolean;
  isNewEventDialogOpen: boolean;
  isAssignmentUpdated: boolean;
  newEventName: string;
  events: any[];

  teams: string[];
  timeframes: any[];
  FTs: FT[];
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

export default Vue.extend({
  name: "Assignment",
  components: { OverTasks, OverCalendar, FilteredUsers },
  data(): Data {
    return {
      timeslots: [],

      selectedUser: undefined,
      selectedDay: undefined,
      selectedTimeframe: undefined,
      isFeedbackSnackbarOpen: false,
      isInfoDisplayed: false,
      isNewEventDialogOpen: false,
      isAssignmentUpdated: true,
      newEventName: "",
      selectedDate: undefined,
      events: [],

      teams: [],
      timeframes: [],

      FTs: [],
    };
  },

  computed: {
    userAvailabilities(): Timeframe[] {
      return [];
    },
    calendarDisplayedEvents(): any[] {
      // let events: any[] = [];
      // if (this.selectedUser) {
      //   if (this.selectedUser.assigned) {
      //     // add assigned tasks
      //     events = this.selectedUser.assigned;
      //   }
      //   if (this.selectedUser.availabilities) {
      //     // add availabilities
      //     this.selectedUser.availabilities.forEach((availability) => {
      //       availability.days.forEach((day) => {
      //         day.frames.forEach((frame) => {
      //           let existingEvent = events.find((e) => {
      //             return (
      //               e.name === "Disponible" &&
      //               e.schedule.start ===
      //                 new Date(day.date + " " + frame.start) &&
      //               e.end === new Date(day.date + " " + frame.end)
      //             );
      //           });
      //           if (!existingEvent) {
      //             events.push({
      //               name: "Disponible",
      //               color: "rgba(92,138,217,0.56)",
      //               schedule: {
      //                 start: new Date(day.date + " " + frame.start),
      //                 end: new Date(day.date + " " + frame.end),
      //               },
      //             });
      //           }
      //         });
      //       });
      //     });
      //   }
      // }
      //
      // return events;
      return [];
    },

    availableTimeslots(): any {
      if (this.selectedUser && this.selectedUser.availabilities) {
        return this.selectedUser.availabilities.map((_id) => {
          return this.timeslots.find((timeslot) => timeslot._id === _id);
        });
      }
      return [];
    },
  },

  watch: {
    selectedTimeframe() {
      const selectedDayTimestamp = this.timeframes.find(
        (e) => e.name === this.selectedTimeframe
      );
      if (selectedDayTimestamp) {
        this.selectedDay = selectedDayTimestamp.day;
      }
    },
  },

  async mounted() {
    if (!(await this.hasRole("hard"))) {
      alert("vous avez pas le role 'hard' pour acceder a cette page");
      await this.$router.push({
        path: "/",
      });
    }

    const res = await safeCall(this.$store, ftRepo.getAllFTs(this));
    if (res) {
      this.FTs = res.data;
    }
    await this.$accessor.assignment.fetchTimeslots();
  },

  methods: {
    async hasRole(role: string): Promise<boolean> {
      return this.$accessor.user.hasRole(role);
    },

    async saveUser() {
      // return this.$axios.put(`/user/${this.selectedUser._id}`, {
      //   assigned: this.selectedUser.assigned.filter((e) => e.FTID),
      // });
      // TODO :: change this
    },

    async saveFT(assignmentID: string, FTID: number, FT: FT) {
      // if (this.selectedUser && this.selectedUser.assigned) {
      //   const newSchedule = this.selectedUser.assigned.find(
      //     (e) => e.FTID === FTID
      //   ); // the schedule that needs to be added to the FT
      //   if (newSchedule) {
      //     let schedules = FT.schedules;
      //     let concernedSchedule = schedules.find((s) => {
      //       const start = new Date(s.start);
      //       const end = new Date(s.end);
      //       return (
      //         start.getTime() === newSchedule.schedule.start.getTime() &&
      //         end.getTime() === newSchedule.schedule.end.getTime()
      //       );
      //     });
      //     if (concernedSchedule) {
      //       if (!concernedSchedule.assigned) {
      //         concernedSchedule.assigned = [];
      //       }
      //       concernedSchedule.assigned.push({
      //         _id: assignmentID,
      //         userID: this.selectedUser._id,
      //         username:
      //           this.selectedUser.firstname + "." + this.selectedUser.lastname,
      //       });
      //     }
      //     return this.$axios.put("/ft", {
      //       _id: FTID,
      //       schedules,
      //     });
      //   }
      // }
    },

    async unassign() {
      // if (this.selectedUser.assigned) {
      //   this.selectedUser.assigned = this.selectedUser.assigned.filter(
      //     (assignedTask) => assignedTask.FTID !== timeframe.FTID
      //   );
      //   // save in database
      //   // save user
      //   await this.$axios.$put(`user/${this.selectedUser._id}`, {
      //     assigned: this.selectedUser.assigned,
      //   });
      //   // save ft
      //   await this.$axios.put("FT/unassign", timeframe);
      // }
    },

    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    getConfig(key: string) {
      return this.$accessor.config.getConfig(key);
    },

    onSelectedUser(user: User) {
      this.$accessor.user.setSelectedUser(user);
      this.selectedUser = user;
      console.log(this.$accessor.assignment.availabilities);
    },
  },
});
</script>

<style scoped>
.container {
  padding: 0;
}
</style>
