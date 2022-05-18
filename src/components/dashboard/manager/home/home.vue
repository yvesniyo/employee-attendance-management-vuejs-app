<template>
  <div class="md-layout ml-2 mr-2">
    <div class="container">
      <div class="md-layout-item mt-4 md-size-100">
        <div class="md-layout md-alignment-center-space-between">
          <div class="md-layout-item md-size-50 text-left">
            <span class="md-body-1">Hi, {{ userLastName }}</span>
            <span class="md-caption d-block">Today {{ getDateToday() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mt-4">
      <div class="row">
        <div class="col-2 m-2 md-elevation-4">
          <div class="md-layout-item md-layout">
            <div class="md-layout-item text-left p-2">
              <span class="md-caption d-block text-dark">
                {{ $t("My Code") }}
              </span>
              <span class="md-caption text-dark font-weight-bold"
                >{{ user.code == null ? "N\\A" : user.code }}
              </span>
            </div>
          </div>
        </div>
        <div class="col-2 m-2 md-elevation-4 bg-warning">
          <div class="md-layout-item md-layout">
            <div class="md-layout-item text-left p-2">
              <span class="md-caption d-block text-dark">
                {{ $t("Total Employees") }}
              </span>
              <span class="md-caption text-dark font-weight-bold"
                >{{ overview.totol_employees }}
              </span>
            </div>
          </div>
        </div>
        <div class="col-2 m-2 md-elevation-4 bg-warning">
          <div class="md-layout-item md-layout">
            <div class="md-layout-item text-left p-2">
              <span class="md-caption d-block text-dark">
                {{ $t("Total Managers") }}
              </span>
              <span class="md-caption text-dark font-weight-bold"
                >{{ overview.total_managers }}
              </span>
            </div>
          </div>
        </div>

        <div class="col-2 m-2 md-elevation-4 bg-warning">
          <div class="md-layout-item md-layout">
            <div class="md-layout-item text-left p-2">
              <span class="md-caption d-block text-dark">
                {{ $t("Today In Attendance") }}
              </span>
              <span class="md-title font-weight-bold"
                >{{ overview.total_attendance_in_today }}
              </span>
            </div>
          </div>
        </div>

        <div class="col-2 m-2 md-elevation-4 bg-warning">
          <div class="md-layout-item md-layout">
            <div class="md-layout-item text-left p-2">
              <span class="md-caption d-block text-dark">
                {{ $t("Today Out Attendance") }}
              </span>
              <span class="md-title font-weight-bold"
                >{{ overview.total_attendance_out_today }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/plugins/bus.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "dashboard-home",
  components: {},
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      overview: "managerDashboard/overview"
    }),
    userLastName: function() {
      if (!this.user.name) return this.user.name;
      const array_names = this.user.name.split(" ");
      return array_names[array_names.length - 1];
    }
  },
  data: () => {
    return {};
  },
  mounted() {
    bus.$emit("show-ajax-loader");
    this.getManagerOverview()
      .then(() => {
        bus.$emit("hide-ajax-loader");
      })
      .catch(() => {
        bus.$emit("hide-ajax-loader");
      });
  },

  methods: {
    ...mapActions({
      getManagerOverview: "managerDashboard/getDashboardData"
    }),

    getDateToday() {
      const today = new Date();
      return today.toDateString();
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "~vue-material/theme/engine";
.speed-dial {
  z-index: 20;
  display: none;
}
</style>
