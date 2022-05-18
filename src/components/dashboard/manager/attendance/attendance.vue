<template>
  <div class="row">
    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 m-auto">
      <div class="block mt-5">
        <el-date-picker
          v-model="dateRangeAttendance"
          type="daterange"
          range-separator="-"
          @change="dateRangeAttendanceChanged"
          start-placeholder="Start date"
          end-placeholder="End date"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="col-12 text-right">
      <el-button @click="exportAttendance">Export</el-button>
    </div>
    <div class="col-md-12 p-0 mt-5">
      <el-timeline>
        <el-timeline-item
          v-for="(attendance, index) in attendances"
          :key="index"
          :timestamp="attendance.date"
          placement="top"
        >
          <el-card>
            <h4>{{ attendance.data.length }} People attended</h4>

            <p
              v-for="(employee, attendance_id) in attendance.data"
              :key="attendance_id"
            >
              {{ attendance_id + 1 }}. {{ employee.employee.name }}.
              <el-tag type="success"
                >{{ employee.time_arrived_at }} -
                {{ employee.time_left_at }}</el-tag
              >
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { bus } from "@/plugins/bus.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "attendance",
  components: {},
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      attendances: "attendance/attendances",
    }),
  },
  data: () => {
    return {
      dateRangeAttendance: [new Date(), new Date()],
    };
  },
  mounted() {
    let from = this.dateRangeAttendance[0];
    from.setDate(from.getDate() - 1);

    let to = this.dateRangeAttendance[1];
    to.setDate(to.getDate() - 1);

    this.dateRangeAttendanceChanged([from, to]);
  },

  methods: {
    ...mapActions({
      fetchAttendance: "attendance/fetchAttendances",
      exportAttendanceRequest: "attendance/exportAttendances",
    }),
    exportAttendance: function () {
      const from = new Date(Date.parse(this.dateRangeAttendance[0]))
        .toISOString()
        .slice(0, 10);
      const to = new Date(Date.parse(this.dateRangeAttendance[1]))
        .toISOString()
        .slice(0, 10);
      bus.$emit("show-ajax-loader");
      this.exportAttendanceRequest({
        from,
        to,
      })
        .then(() => {
          bus.$emit("hide-ajax-loader");
        })
        .catch(() => {
          bus.$emit("hide-ajax-loader");
        });
    },
    dateRangeAttendanceChanged: function async(date) {
      const from = new Date(Date.parse(date[0])).toISOString().slice(0, 10);
      const to = new Date(Date.parse(date[1])).toISOString().slice(0, 10);
      bus.$emit("show-ajax-loader");
      this.fetchAttendance({
        from,
        to,
      })
        .then(() => {
          bus.$emit("hide-ajax-loader");
        })
        .catch(() => {
          bus.$emit("hide-ajax-loader");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "~vue-material/theme/engine";

* {
  text-align: initial;
}
</style>