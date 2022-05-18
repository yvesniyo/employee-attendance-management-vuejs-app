<template>
  <div class="page-container">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <span class="md-title">{{ $t("Forget Password") }}</span>
      </md-app-toolbar>

      <md-app-content>
        <div class="row">
          <div class="col-sm-12 col-md-4 col-lg-4 m-auto">
            <form class="md-layout" @submit.prevent="submit">
              <md-field :class="{ 'md-invalid': valid.email }">
                <label for="email">{{ $t("Email") }} </label>
                <md-input
                  name="email"
                  id="email"
                  autocomplete="none"
                  v-model="form.email"
                  :disabled="sending"
                />
                <span class="md-error" v-if="valid.email">{{
                  valid.email
                }}</span>
              </md-field>

              <md-snackbar :md-active.sync="formSubmitResponseStatus">
                {{ formSubmitResponseMessage }}
              </md-snackbar>

              <md-button
                :disabled="sending"
                class="md-raised md-primary md-ripple-enter-active"
                style="flex: 1"
                type="submit"
                >{{ $t("Send Reset Link") }}
              </md-button>
            </form>
          </div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { bus } from "@/plugins/bus.js";

export default {
  name: "forget-password",
  data: () => ({
    form: {
      email: "",
    },
    valid: {
      email: null,
    },
    userLoggedIn: false,
    sending: false,
    formSubmitResponseMessage: "",
    formSubmitResponseStatus: false,
  }),
  async created() {
    const user = await this.getUserProfile();
    if (user) {
      if (user.position == "MANAGER") {
        this.$router.replace({ name: "dashboard" });
      }
    }
  },

  methods: {
    ...mapActions({
      sendResetLink: "auth/sendResetLink",
      myProfile: "auth/me",
    }),
    ...mapGetters({
      getUserProfile: "auth/user",
    }),
    clearForm() {
      this.form.email = null;
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
      bus.$emit("show-ajax-loader");
      const ctx = this;

      this.sendResetLink(this.form)
        .then((data) => {
          console.log(data.data);
          ctx.sending = false;
          bus.$emit("hide-ajax-loader");
          ctx.formSubmitResponseMessage = data.data.message;
          ctx.formSubmitResponseStatus = true;

          setTimeout(() => this.$router.replace({ name: "login" }), 4000);
        })
        .catch((error) => {
          ctx.sending = false;
          bus.$emit("hide-ajax-loader");
          if (error.response.status == 422) {
            ctx.formSubmitResponseMessage = error.response.data.message;
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
