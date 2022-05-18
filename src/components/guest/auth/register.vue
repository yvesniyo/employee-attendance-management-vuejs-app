<template>
  <div class="page-container">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <span class="md-title">{{ $t("Register") }}</span>
      </md-app-toolbar>

      <md-app-content>
        <div class="row md-centered">
          <div class="col-sm-12 col-md-4 col-lg-4 m-auto">
            <form class="md-layout" @submit.prevent="submit">
              <md-field :class="{ 'md-invalid': valid.national_id }">
                <label for="repeat_password">{{
                  $t("National Identity")
                }}</label>
                <md-input
                  name="national_id"
                  id="national_id"
                  type="text"
                  autocomplete="none"
                  v-model="form.national_id"
                  :disabled="sending"
                />
                <span class="md-error" v-if="valid.national_id">
                  {{ valid.national_id }}
                </span>
              </md-field>

              <md-field :class="{ 'md-invalid': valid.name }">
                <label for="repeat_password">{{ $t("Name") }}</label>
                <md-input
                  name="name"
                  id="name"
                  type="text"
                  autocomplete="none"
                  v-model="form.name"
                  :disabled="sending"
                />
                <span class="md-error" v-if="valid.name">
                  {{ valid.name }}
                </span>
              </md-field>

              <md-field :class="{ 'md-invalid': valid.email }">
                <label for="email">{{ $t("Email") }}</label>
                <md-input
                  name="email"
                  id="email"
                  autocomplete="none"
                  v-model="form.email"
                />
                <span class="md-error" v-if="valid.email">{{
                  valid.email
                }}</span>
              </md-field>

              <md-field
                :class="{ 'md-invalid': valid.dob, 'block-content': true }"
              >
                <label for="dob">{{ $t("Date of Birth") }}</label>

                <el-date-picker
                  v-model="form.dob"
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="Pick DOB"
                  :disabled="sending"
                  class="w-100"
                >
                </el-date-picker>
                <span class="md-error" v-if="valid.dob">
                  {{ valid.dob }}
                </span>
              </md-field>

              <md-field :class="{ 'md-invalid': valid.password }">
                <label for="password">{{ $t("Password") }}</label>
                <md-input
                  name="password"
                  id="password"
                  type="password"
                  autocomplete="none"
                  v-model="form.password"
                  :disabled="sending"
                />
                <span class="md-error" v-if="valid.password">
                  {{ valid.password }}
                </span>
              </md-field>

              <md-field :class="{ 'md-invalid': valid.repeat_password }">
                <label for="repeat_password">{{ $t("Repeat Password") }}</label>
                <md-input
                  name="repeat_password"
                  id="repeat_password"
                  type="password"
                  autocomplete="none"
                  v-model="form.repeat_password"
                  :disabled="sending"
                />
                <span class="md-error" v-if="valid.repeat_password">
                  {{ valid.repeat_password }}
                </span>
              </md-field>

              <md-snackbar :md-active.sync="formSubmitResponseStatus">
                {{ formSubmitResponseMessage }}
              </md-snackbar>

              <md-button
                :disabled="sending"
                class="md-raised md-primary md-ripple-enter-active"
                style="flex: 1"
                type="submit"
                >{{ $t("Register") }}
              </md-button>
              <div class="container">
                <span>Already have account </span>
                <router-link to="login">
                  <span>Login</span>
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { bus } from "@/plugins/bus.js";

export default {
  name: "register",
  data: () => ({
    form: {
      name: "",
      dob: "",
      national_id: "",
      password: "",
      email: "",
      repeat_password: "",
    },
    valid: {
      name: "",
      dob: "",
      national_id: "",
      email: null,
      password: null,
      repeat_password: null,
    },
    userLoggedIn: false,
    sending: false,
    formSubmitResponseMessage: "",
    formSubmitResponseStatus: false,
  }),
  created() {},

  methods: {
    ...mapActions({
      register: "auth/register",
    }),
    clearForm() {
      this.form.password = null;
      this.form.email = null;
      this.form.national_id = null;
      this.form.name = null;
      this.form.dob = null;
    },
    clearLastErrors: function () {
      const ctx = this;
      Object.keys(this.valid).forEach(function (key) {
        ctx.$set(ctx.valid, key, null);
      });
    },
    async submit() {
      this.sending = true;
      this.clearLastErrors();
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      const ctx = this;

      this.register(this.form)
        .then((data) => {
          ctx.sending = false;
          loading.close();

          ctx.formSubmitResponseMessage = data.data.message;
          ctx.formSubmitResponseStatus = true;

          setTimeout(() => this.$router.push({ name: "dashboard" }), 5000);
        })
        .catch((error) => {
          ctx.sending = false;
          loading.close();

          if (error.response.status == 422) {
            ctx.formSubmitResponseMessage =
              error.response.data.message ?? "Invalid data";
            ctx.formSubmitResponseStatus = true;
            Object.keys(error.response.data.errors).forEach(function (key) {
              ctx.$set(ctx.valid, key, error.response.data.errors[key][0]);
            });
          } else if (error.response.status == 500) {
            ctx.formSubmitResponseMessage = error.response.data.message;
            ctx.formSubmitResponseStatus = true;
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
.form {
  margin: auto;
  margin-top: 40px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
