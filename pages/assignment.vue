<template>
  <v-container
    style="
      left: 0;
      max-width: none;
      margin-left: 0;
      margin-right: 0;
      position: absolute;
      display: flex;
    "
  >
    <div style="display: flex; flex-flow: column; max-width: 300px">
      <!-- list of  filtered users -->
      <v-card>
        <v-card-text>
          <h3>Filtres</h3>
          <v-select label="evenements"></v-select>
          <div>
            <v-btn icon @click="moveCalendar()">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn icon @click="moveCalendar(true)">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </div>

          <v-text-field
              prepend-icon="mdi-card-search"
              v-model="filters.name"
              label="recherche d'orga"
          ></v-text-field>
          <v-combobox
              chips
              multiple
              clearable
            label="team"
            :items="getConfig('teams').map((e) => e.name)"
            v-model="filters.teams"
          >
            <template v-slot:selection="{ attrs, item, selected }">
              <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  :color="getRoleMetadata(item).color"
              >
                <v-icon left color="white">
                  {{ getRoleMetadata(item).icon }}
                </v-icon>
                <a style="color: white">{{ getRoleMetadata(item).name }}</a>
              </v-chip>
            </template>
          </v-combobox>
          <v-divider></v-divider>

          <v-list style="overflow-y: auto; height: 500px">
            <v-list-item-group v-model="selectedUserIndex">
              <v-list-item v-for="user of filteredUsers" v-bind:key="user._id">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ user.firstname }} {{ user.lastname.toUpperCase() }}
                    {{ user.nickname ? `(${user.nickname})` : "" }}
                    {{ user.charisma }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <over-chips :roles="user.team"></over-chips>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-tooltip top @click="selectedUser = user">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                          dark
                          v-bind="attrs"
                          v-on="on"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>{{ user.comment }}</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- list of selected user's friend -->
      <!--      <v-card v-if="getSelectedUser && getSelectedUser.friends">-->
      <!--        <v-list>-->
      <!--          <v-subheader>les amis du user selectionné</v-subheader>-->
      <!--          <v-list-item-group v-model="selectedUserFriend">-->
      <!--            <v-list-item-->
      <!--              v-for="friend of getSelectedUser.friends"-->
      <!--              v-bind:key="friend.keycloakID"-->
      <!--            >-->
      <!--              <v-list-item-content>-->
      <!--                <h4>{{ friend.username ? friend.username : friend }}</h4>-->
      <!--                &lt;!&ndash;          <v-chip>{{user.charisma}}</v-chip>&ndash;&gt;-->
      <!--              </v-list-item-content>-->
      <!--              <v-list-item-action>-->
      <!--                <v-icon>mdi-information-outline</v-icon>-->
      <!--              </v-list-item-action>-->
      <!--            </v-list-item>-->
      <!--          </v-list-item-group>-->
      <!--        </v-list>-->
      <!--      </v-card>-->
    </div>
    <!-- calendar --->
    <v-calendar
        style="flex-grow: 2; height: 800px; overflow-y: auto"
        ref="calendar"
        :value="selectedDay"
        :events="selectedUserAvailabilities"
        color="primary"
        type="week"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        @mousedown:event="startDrag"
        @mousedown:time="startTime"
        @mousemove:time="mouseMove"
        @mouseup:time="endDrag"
        @mouseleave.native="cancelDrag"
    ></v-calendar>

    <div style="display: flex; flex-flow: column">
      <v-card v-if="getSelectedUser">
        <v-img
          v-if="getSelectedUser.pp"
          :src="getPPUrl() + 'api/user/pp/' + getSelectedUser.pp"
          max-height="200px"
        ></v-img>
        <v-card-title
          >{{ getSelectedUser.firstname }}.{{
            getSelectedUser.lastname
          }}</v-card-title
        >
      </v-card>
      <!-- list of users -->
      <v-card>
        <v-list>
          <v-subheader>Tâches</v-subheader>
          <v-list-item-group v-model="selectedAssignmentsIndex" multiple>
            <v-list-item
              v-for="schedule in filteredSchedules"
              v-bind:key="schedule._id"
            >
              <v-list-item-content>
                {{ schedule.name }} {{ schedule.schedule.date }}
                {{ schedule.schedule.start }} ➡️ {{ schedule.schedule.end }}
              </v-list-item-content>
              <v-list-item-icon
                ><v-icon> mdi-information </v-icon></v-list-item-icon
              >
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>

    <v-btn
        fab
        v-if="getSelectedUser"
        @click="saveAssignment"
        style="position: fixed; right: 20px; bottom: 40px; z-index: 20"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>

    <v-snackbar v-model="isFeedbackSnackbarOpen" :timeout="5000"
    >Sauvgarder 🥳
    </v-snackbar
    >

    <v-dialog v-model="isNewEventDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Commentaire</v-card-title>
        <v-card-text>
          <v-text-field label="Commentaire" v-model="newEventName"></v-text-field>
        </v-card-text>
        <v-card-actions @click="saveNewEventName()">💾</v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import {getConfig, hasRole} from "../common/role";
import Fuse from "fuse.js";
import OverChips from "../components/overChips";

export default {
  name: "assignment",
  components: {OverChips},
  data() {
    return {
      users: [],
      filteredUsers: [],
      selectedUserIndex: undefined,
      selectedAssignmentsIndex: undefined,
      selectedUserFriend: undefined,
      selectedUser: undefined,
      selectedDay: undefined,
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
      teams: this.getConfig("teams"),

      // calendar drag and drop
      dragEvents: [],
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,
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
    // get user list
    this.users = (await this.$axios.get("/user")).data;
    this.filteredUsers = this.users;

    // get FTs
    this.FTs = (await this.$axios.get("/FT")).data.data; // idk but it works
  },

  methods: {
    saveNewEventName() {
      this.getSelectedUser.assigned[this.getSelectedUser.assigned.length - 1].name = this.newEventName;
      this.isNewEventDialogOpen = false;
    },
    // calendar drag and drop
    startDrag({event, timed}) {
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)
        let d = new Date(this.createStart)
        this.createEvent = {
          name: `Event `,
          startTimestamp: this.createStart,
          endTimestamp: this.createStart,
          date: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`,
          start: `${d.getHours()}:${d.getMinutes()}`,
          end: `${d.getHours()}:${d.getMinutes()}`,
          timed: true,
        }

        this.getSelectedUser.assigned.push({name: `Event `, schedule: this.createEvent})
      }
    },
    extendBottom(event) {
      this.createEvent = event
      this.createStart = event.start
      this.extendOriginal = event.end
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms)
      if (this.getSelectedUser && this.getSelectedUser.assigned) {
        const lastEvent = this.getSelectedUser.assigned[this.getSelectedUser.assigned.length - 1].schedule
        if (lastEvent) {
          if (lastEvent && this.dragTime !== null) {
            const start = lastEvent.startTimestamp
            const end = lastEvent.endTimestamp
            const duration = end - start
            const newStartTime = mouse - this.dragTime
            const newStart = this.roundTime(newStartTime)
            const newEnd = newStart + duration

            lastEvent.startTimestamp = newStart
            lastEvent.endTimestamp = newEnd

            let s = new Date(lastEvent.startTimestamp);
            let e = new Date(lastEvent.endTimestamp);

            lastEvent.start = `${s.getHours()}:${s.getMinutes()}`;
            lastEvent.end = `${e.getHours()}:${e.getMinutes()}`;

          } else if (this.createEvent && this.createStart !== null) {
            const mouseRounded = this.roundTime(mouse, false)

            const min = Math.min(mouseRounded, this.createStart)
            const max = Math.max(mouseRounded, this.createStart)

            lastEvent.startTimestamp = min
            lastEvent.endTimestamp = max

            let s = new Date(lastEvent.startTimestamp);
            let e = new Date(lastEvent.endTimestamp);

            lastEvent.start = `${s.getHours()}:${s.getMinutes()}`;
            lastEvent.end = `${e.getHours()}:${e.getMinutes()}`;
          }
        }
      }
    },
    endDrag() {
      this.dragTime = null
      this.dragEvent = null
      this.createEvent = null
      this.createStart = null
      this.extendOriginal = null
      this.isNewEventDialogOpen = true;

    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal
        } else {
          // const i = this.events.indexOf(this.createEvent)
          // if (i !== -1) {
          //   this.events.splice(i, 1)
          // }
        }
      }

      this.createEvent = null
      this.createStart = null
      this.dragTime = null
      this.dragEvent = null
    },
    roundTime(time, down = true) {
      const roundTo = 15 // minutes
      const roundDownTime = roundTo * 60 * 1000

      return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
    },
    toTime(tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },

    getStupidAmericanTimeFormat(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },

    getConfig(key) {
      return getConfig(this, key);
    },

    moveCalendar(isLeft) {
      const currentDate = this.selectedDay ? new Date(this.selectedDay) : new Date()
      currentDate.setDate(currentDate.getDate() + (isLeft ? -7 : 7));
      this.selectedDay = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`
    },

    getCalendarFormattedAssignedFTsOfSelectedUser() {
      let events = [];
      if (this.getSelectedUser && this.getSelectedUser.assigned !== undefined) {
        let assignedFTs = this.getSelectedUser.assigned;
        assignedFTs.forEach((assignedFT) => {
          if (assignedFT.schedule) {
            let start = new Date(
                Date.parse(
                    assignedFT.schedule.date + " " + assignedFT.schedule.start
                )
            );
            let end = new Date(
                Date.parse(assignedFT.schedule.date + " " + assignedFT.schedule.end)
            );

            // add to calendar
            events.push({
              name: assignedFT.name,
              start: this.getStupidAmericanTimeFormat(start),
              end: this.getStupidAmericanTimeFormat(end),
              color: "#ebc034",
            });
          }
        });
      }
      return events;
    },

    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },

    getRoleMetadata(roleName) {
      return this.teams.find((e) => e.name === roleName);
    },

    async saveAssignment() {
      // save FT
      await this.$axios.put(`/user/${this.getSelectedUser.keycloakID}`, {
        assigned: this.getSelectedUser.assigned,
      });
      this.isFeedbackSnackbarOpen = true;
    },
  },

  computed: {
    getSelectedUser() {
      return this.users[this.selectedUserIndex];
    },

    selectedAssignments() {
      if (this.selectedAssignmentsIndex) {
        return this.selectedAssignmentsIndex.map(
            (i) => this.filteredSchedules[i]
        );
      } else {
        return [];
      }
    },

    filteredSchedules() {
      // FTs that are in the selected users availability
      let filteredSchedules = [];
      let userAvailabilities = [];
      if (this.getSelectedUser && this.getSelectedUser.availabilities) {
        this.getSelectedUser.availabilities.forEach((availability) => {
          if (availability.days) {
            availability.days.forEach((day) => {
              day.frames.forEach((frame) => {
                userAvailabilities.push({
                  start: new Date(Date.parse(day.date + " " + frame.start)),
                  end: new Date(Date.parse(day.date + " " + frame.end)),
                });
              });
            });
          }
        });
        userAvailabilities.forEach((timeframe) => {
          this.FTs.forEach((FT) => {
            if (FT.schedules) {
              FT.schedules.forEach((schedule) => {
                let start = Date.parse(schedule.date + " " + schedule.start);
                let end = Date.parse(schedule.date + " " + schedule.end);
                if (timeframe.start <= start && timeframe.end >= end) {
                  filteredSchedules.push({
                    name: FT.name,
                    FTID: FT._id,
                    schedule,
                  });
                }
              });
            }
          });
        });
      }

      return filteredSchedules;
    },

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
    selectedAssignments() {
      // selected assignment changed...
      let user = this.getSelectedUser;
      this.$set(user, "assigned", this.selectedAssignments);
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
        this.filteredUsers.sort((user1, user2) => {
          return Math.sign((user1.charisma || 0) - (user2.charisma || 0))
        })
        this.filteredUsers = users;
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
