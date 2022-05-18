<template>
  <div class="row p-5">
    <div class="col-md-12 p-0">
      <md-app-toolbar class="border-0">
        <span class="md-title">
          {{ $t("Update Employee") }}
        </span>
      </md-app-toolbar>
    </div>
    <div class="col-12 mt-2">
      <form @submit.prevent="saveEmployee">
        <md-field :class="{ 'md-invalid': valid.employee.name }">
          <label for="type">{{ $t("Name") }}</label>
          <md-input
            name="name"
            id="name"
            autocomplete="none"
            v-model="currentEmployee.name"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.employee.name">
            {{ valid.employee.name }}
          </span>
        </md-field>

        <md-field :class="{ 'md-invalid': valid.employee.email }">
          <label for="type">{{ $t("Email") }}</label>
          <md-input
            name="email"
            id="email"
            type="email"
            autocomplete="none"
            v-model="currentEmployee.email"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.employee.email">
            {{ valid.employee.email }}
          </span>
        </md-field>

        <md-field :class="{ 'md-invalid': valid.employee.phone }">
          <label for="type">{{ $t("Phone") }}</label>
          <md-input
            name="phone"
            id="phone"
            type="phone"
            autocomplete="none"
            v-model="currentEmployee.phone"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.employee.phone">
            {{ valid.employee.phone }}
          </span>
        </md-field>

        <md-field :class="{ 'md-invalid': valid.employee.national_id }">
          <label for="national_id">{{ $t("National Identity") }}</label>
          <md-input
            name="national_id"
            id="national_id"
            type="text"
            autocomplete="none"
            v-model="currentEmployee.national_id"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.employee.national_id">
            {{ valid.employee.national_id }}
          </span>
        </md-field>

        <md-field
          :class="{ 'md-invalid': valid.employee.dob, 'block-content': true }"
        >
          <label for="dob">{{ $t("Date of Birth") }}</label>

          <el-date-picker
            v-model="currentEmployee.dob"
            type="date"
            placeholder="Pick DOB"
            :disabled="sending"
            class="w-100"
          >
          </el-date-picker>
          <span class="md-error" v-if="valid.employee.dob">
            {{ valid.employee.dob }}
          </span>
        </md-field>

        <!-- <md-select :class="{ 'md-invalid': valid.employee.position }">
            <label for="dob">{{ $t("Date of Birth") }}</label>
          </md-select> -->

        <md-field
          :class="{
            'md-invalid': valid.employee.status,
            'block-content': true
          }"
        >
          <span for="status" style="text-align: left" class="block">{{
            $t("Status")
          }}</span>

          <el-select
            v-model="currentEmployee.status"
            placeholder="Select"
            class="block w-100"
          >
            <el-option
              v-for="item in form.selectStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="md-error" v-if="valid.employee.status">
            {{ valid.employee.status }}
          </span>
        </md-field>

        <md-field
          :class="{
            'md-invalid': valid.employee.position,
            'block-content': true
          }"
        >
          <span for="position" style="text-align: left" class="block">{{
            $t("Position")
          }}</span>

          <el-select
            v-model="currentEmployee.position"
            placeholder="Select"
            class="block w-100"
          >
            <el-option
              v-for="item in form.selectPositionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="md-error" v-if="valid.employee.position">
            {{ valid.employee.position }}
          </span>
        </md-field>

        <md-snackbar :md-active.sync="employeeSaved">
          {{ $t("The user was saved with success!") }}
        </md-snackbar>
        <md-snackbar :md-active.sync="formSubmitResponse">
          {{ employeeCreateResponse }}
        </md-snackbar>
        <md-button
          type="submit"
          class="md-primary md-raised w-100"
          :disabled="sending"
        >
          {{ $t("Update") }}
        </md-button>
      </form>
    </div>
  </div>
</template>

<script>
import { bus } from "@/plugins/bus.js";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {},
  props: ["employee_id"],
  name: "update-employee",
  computed: {
    ...mapGetters({
      currentEmployee: "employees/currentEmployee"
    })
  },
  data: () => ({
    form: {
      selectStatusOptions: [
        {
          value: "ACTIVE",
          label: "ACTIVE"
        },
        {
          value: "INACTIVE",
          label: "INACTIVE"
        }
      ],
      selectPositionOptions: [
        {
          value: "MANAGER",
          label: "MANAGER"
        },
        {
          value: "TESTER",
          label: "TESTER"
        },
        {
          value: "DESIGNER",
          label: "DESIGNER"
        },
        {
          value: "DEVOPS",
          label: "DEVOPS"
        }
      ],
      employee: {
        name: "",
        email: "",
        phone: "",
        national_id: "",
        dob: "",
        position: "TESTER",
        status: "ACTIVE"
      }
    },

    sending: false,
    employeeSaved: false,
    lastEmployee: "",
    formSubmitResponse: false,
    employeeCreateResponse: null,
    valid: {
      employee: {
        name: null,
        email: null,
        phone: null,
        national_id: null,
        dob: null,
        position: "",
        status: ""
      }
    }
  }),
  methods: {
    ...mapActions({
      getEmployee: "employees/getEmployee",
      updateEmployee: "employees/updateEmployee"
    }),
    saveEmployee: function() {
      this.sending = true;
      this.lastEmployee = this.currentEmployee.name;
      this.employeeCreateResponse = null;
      this.formSubmitResponse = false;
      this.clearLastErrors();
      bus.$emit("show-ajax-loader");

      const ctx = this;
      this.updateEmployee(this.currentEmployee)
        .then(response => {
          ctx.sending = false;
          ctx.employeeSaved = true;
          ctx.formSubmitResponse = true;
          console.log(response);
          bus.$emit("hide-ajax-loader");
          bus.$emit("new-employee-created");
          ctx.clearForm();
          ctx.employeeCreateResponse = "Employee Updated successfully";

          ctx.$router.push({ name: "all-employees" });
        })
        .catch(function(error) {
          bus.$emit("hide-ajax-loader");
          ctx.sending = false;
          ctx.employeeSaved = false;
          if (error.response.status == 422) {
            let errors = error.response.data.errors;
            let message = error.response.data.message;
            ctx.employeeCreateResponse = message;
            ctx.formSubmitResponse = true;
            Object.keys(errors).forEach(function(key) {
              ctx.$set(ctx.valid.employee, key, errors[key][0]);
            });
          } else if (error.response.status == 500) {
            let message = error.response.data.message;
            ctx.employeeCreateResponse = message;
            ctx.formSubmitResponse = true;
          }
        });
    },
    clearLastErrors: function() {
      const ctx = this;
      Object.keys(this.valid.employee).forEach(function(key) {
        ctx.$set(ctx.valid.employee, key, null);
      });
    },
    clearForm: function() {
      this.form.employee = {
        name: "",
        email: "",
        phone: "",
        national_id: "",
        dob: "",
        position: "TESTER",
        status: "ACTIVE"
      };
      this.valid = {
        employee: {
          name: null,
          email: null,
          phone: null,
          national_id: null,
          dob: null,
          position: "",
          status: ""
        }
      };
    },
    initDateValues: function() {}
  },

  created() {
    this.$material.locale.dateFormat = "yyyy-MM-dd";
    this.initDateValues();

    bus.$emit("show-ajax-loader");
    this.getEmployee(this.employee_id)
      .then(() => {
        bus.$emit("hide-ajax-loader");
      })
      .catch(() => {
        bus.$emit("hide-ajax-loader");
      });
  }
};
</script>

<style lang="scss" scoped>
.fab {
  z-index: 10;
  bottom: 120px;
  right: 30px;
}
.block-content {
  display: flex;
  flex-direction: column;
}
</style>
