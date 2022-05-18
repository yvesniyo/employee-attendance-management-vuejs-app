<template>
  <div class="infinite-list-wrapper" style="overflow: auto; height: 100vh">
    <md-list
      class="md-triple-line bg-transparent"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
    >
      <md-list-item
        @click="openParticipant(employee.id)"
        class="mb-2 bg-white pt-1 pb-1"
        v-for="employee in employees"
        :key="employee.id"
      >
        <md-avatar class="md-avatar-icon md-primary">
          {{ employee.name.substring(0, 1) }}
        </md-avatar>
        <div class="md-list-item-text">
          <div class="row">
            <div class="col-8">
              <p style="display: flex; flex-direction: column">
                <span class="font-weight-bolder">
                  {{ employee.name }} / {{ employee.phone }}</span
                >

                <span class="mt-1">Code {{ employee.code }}</span>
                <span class="mt-1 md-caption"
                  >Position {{ employee.position }}</span
                >
                <span class="mt-1 md-caption"> {{ employee.email }}</span>
              </p>
            </div>
            <div class="col-4">
              <el-button
                size="mini"
                @click="markAttendance(employee.id)"
                v-if="employee.today_attendance == null"
                class="md-primary md-raised w-100"
              >
                {{ $t("Mark Arrival") }}
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="markAttendance(employee.id)"
                v-if="
                  employee.today_attendance != null &&
                    employee.today_attendance.left_at == null
                "
                class="md-accent md-raised w-100"
              >
                {{ $t("Mark Leave") }}
              </el-button>
            </div>
          </div>
        </div>
      </md-list-item>
    </md-list>
    <p v-if="loading" class="text-center">{{ $t("Loading...") }}</p>
    <p v-if="noMore" class="text-center">{{ $t("No more") }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../../../plugins/bus";
import dashboardTopbarVue from "../../../common/dashboard-topbar.vue";
export default {
  name: "EmployeesListTemplate",
  props: ["employees", "loading", "noMore"],
  computed: {
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    ...mapActions({
      registerAttendance: "employees/markAttendance"
    }),
    openParticipant: function(id) {
      // this.$router.push({
      //   name: "view-employe",
      //   params: {
      //     id,
      //   },
      // });
    },
    markAttendance(id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      const ctx = this;

      this.registerAttendance({
        employee_id: id
      })
        .then(response => {
          loading.close();
          bus.$emit("new-attendance-recorded", response.data);

          const message = response.data.message;

          this.$notify({
            title: "Attendance",
            message: message,
            type: "success"
          });
        })
        .catch(error => {
          loading.close();
        });
    },
    load() {
      this.$emit("load");
    }
  }
};
</script>

<style></style>
