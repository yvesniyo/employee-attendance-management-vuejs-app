<template>
  <div class="row md-transparent p-5">
    <div class="col-12 text-right">
      <el-button @click="goToCreateEmployee"> Add new Employee </el-button>
    </div>
    <div class="col-md-12 pt-2">
      <form class="form">
        <el-input
          placeholder="Search people"
          v-model="searchText"
          class="input-with-select"
        >
          <el-select
            v-model="query.searchFilter"
            slot="prepend"
            placeholder="Select"
          >
            <el-option label="Phone" value="phone"></el-option>
            <el-option label="Name" value="name"></el-option>
            <el-option label="Email" value="email"></el-option>
            <el-option label="Code" value="code"></el-option>
          </el-select>
          <el-button
            slot="append"
            @click="searchInputChanged"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </form>
    </div>
    <div class="col-12">
      <div class="row">
        <div class="col-md-12">
          <el-table
            :data="employees.data"
            v-loading="loadingEmployees"
            style="width: 100%"
          >
            <el-table-column fixed prop="code" label="code" width="150">
            </el-table-column>
            <el-table-column prop="name" label="Name"> </el-table-column>
            <el-table-column prop="email" label="Email"> </el-table-column>
            <el-table-column prop="phone" label="Phone"> </el-table-column>
            <el-table-column prop="national_id" label="NID" width="300">
            </el-table-column>
            <el-table-column prop="dob" label="Dob" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="Operations" width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="warning"
                  @click="markAttendance(scope.row.id)"
                  v-if="scope.row.today_attendance == null"
                >
                  {{ $t("Attend In") }}
                </el-button>
                <el-button
                  type="warning"
                  size="mini"
                  @click="markAttendance(scope.row.id)"
                  v-if="
                    scope.row.today_attendance != null &&
                    scope.row.today_attendance.left_at == null
                  "
                >
                  {{ $t("Attend Out") }}
                </el-button>

                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >Edit</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >Delete</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="Number.parseInt(employees.per_page)"
            :total="employees.total"
            @current-change="goToCurrentPage"
            @next-click="goToNextPage"
            @prev-click="goToPrevPage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { debounce } from "../../../../plugins/debounce";
import { bus } from "../../../../plugins/bus";

export default {
  components: {},
  name: "all-employees",
  computed: {
    ...mapGetters({
      employees: "employees/employees",
    }),
  },
  watch: {
    searchText: debounce(function (newVal) {
      this.query.search = newVal;
      this.query.page = 0;
      this.searchInputChanged();
    }, 1000),
  },
  data: () => {
    return {
      searchText: "",
      query: {
        searchFilter: "name",
        search: "",
        limit: 10,
        page: 1,
        reload: false,
      },
      loadingEmployees: false,
      noMoreEmployees: false,
    };
  },
  created() {
    this.searchInputChanged();
    bus.$on("new-employee-created", () => {
      this.newEmployeeCreated();
    });

    bus.$on("new-attendance-recorded", (data) => {
      this.newAttendanceRecord(data);
    });
  },
  methods: {
    ...mapActions({
      searchEmployees: "employees/search",
      deleteEmployee: "employees/deleteEmployee",
      registerAttendance: "employees/markAttendance",
    }),
    markAttendance(id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      const ctx = this;

      this.registerAttendance({
        employee_id: id,
      })
        .then((response) => {
          loading.close();
          bus.$emit("new-attendance-recorded", response.data);

          const message = response.data.message;

          this.$notify({
            title: "Attendance",
            message: message,
            type: "success",
          });
        })
        .catch((error) => {
          loading.close();
        });
    },
    goToCreateEmployee() {
      console.log("");
      this.$router.push({ name: "create-employee" });
    },
    loadMoreEmployees() {
      this.query.page += 1;
      this.searchInputChanged();
    },
    newEmployeeCreated() {
      this.query.reload = true;
      this.searchInputChanged();
      this.query.reload = false;
    },

    newAttendanceRecord(data) {
      this.query.reload = true;

      this.searchInputChanged();

      this.query.reload = false;
    },
    handleEdit: function (id, data) {
      this.$router.push({
        name: "update-employee",
        params: { employee_id: data.id },
      });
    },
    handleDelete: function (id, data) {
      bus.$emit("show-ajax-loader");
      this.deleteEmployee(data.code)
        .then((response) => {
          const data = response.data;
          this.searchInputChanged();
          bus.$emit("hide-ajax-loader");
        })
        .catch((error) => {
          bus.$emit("hide-ajax-loader");
        });
    },
    goToNextPage: function (data) {
      this.loadPage(data);
    },
    goToPrevPage: function (data) {
      this.loadPage(data);
    },
    goToCurrentPage: function (data) {
      this.loadPage(data);
    },
    loadPage: function (page) {
      this.query.page = page;
      this.searchInputChanged();
    },
    searchInputChanged() {
      this.loadingEmployees = true;
      bus.$emit("show-ajax-loader");
      this.searchEmployees(this.query)
        .then((response) => {
          this.loadingEmployees = false;
          const data = response.data;
          if (data.current_page == data.last_page) {
            this.noMoreEmployees = true;
          } else {
            this.noMoreEmployees = false;
          }
          bus.$emit("hide-ajax-loader");
        })
        .catch((error) => {
          this.loadingEmployees = false;
          bus.$emit("hide-ajax-loader");
        });
    },
  },
};
</script>

<style lang="sass" scoped></style>
