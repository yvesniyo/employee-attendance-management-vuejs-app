<template>
  <div class="row">
    <div class="col-md-12 p-0">
      <div class="md-layout bg-white mt-3">
        <div class="md-layout-item md-size-20 pt-3">
          <md-avatar class="md-avatar-icon md-primary">{{
            user.name.substring(0, 1)
          }}</md-avatar>
        </div>
        <div class="md-layout-item md-size-55 pt-1 text-left">
          <label class="md-title d-block">{{ user.name }}</label>
          <label class="text-secondary d-block">{{ user.phone }}</label>
          <label class="text-secondary d-block text-sm-left">{{
            user.email
          }}</label>
        </div>
        <div class="md-layout-item md-size-20 pt-4 pr-3 text-left"></div>
      </div>
    </div>

    <div class="col-md-12 p-0">
      <div class="md-layout bg-white border-top pb-3">
        <div class="md-layout-item md-size-20 pt-3">
          <md-avatar class="">
            <md-icon>language</md-icon>
          </md-avatar>
        </div>
        <div class="md-layout-item md-size-80 pt-4 text-left">
          <label class="text-dark d-block">{{ $t("Change Language") }}</label>
        </div>
      </div>
      <div class="md-layout bg-white border-top pb-3">
        <div class="md-layout-item md-size-20 pt-3">
          <md-avatar class="">
            <md-icon>help</md-icon>
          </md-avatar>
        </div>
        <div class="md-layout-item md-size-80 pt-4 text-left">
          <label class="text-dark d-block">{{ $t("Help") }}</label>
        </div>
      </div>
      <div class="md-layout bg-white border-top pb-3">
        <div class="md-layout-item md-size-20 pt-3">
          <md-avatar class="">
            <md-icon>policy</md-icon>
          </md-avatar>
        </div>
        <div class="md-layout-item md-size-80 pt-4 text-left">
          <label class="text-dark d-block">{{ $t("Policies") }}</label>
        </div>
      </div>
    </div>

    <div class="col-md-12 p-0">
      <div @click="logout()" class="md-layout bg-white mt-3 pb-3">
        <div class="md-layout-item md-size-20 pt-3">
          <md-avatar class="">
            <md-icon>logout</md-icon>
          </md-avatar>
        </div>
        <div class="md-layout-item md-size-80 pt-4 text-left">
          <label class="text-dark d-block">{{ $t("Logout") }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/plugins/bus.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "my-account",
  components: {},
  computed: {
    ...mapGetters({
      user: "auth/user"
    })
  },
  created() {
    // bus.$emit("show-ajax-loader");
  },

  methods: {
    ...mapActions({
      getNewCode: "auth/getNewCode",
      signOut: "auth/signOut"
    }),
    generateNewCode() {
      bus.$emit("show-ajax-loader");
      this.getNewCode()
        .then(response => {
          bus.$emit("hide-ajax-loader");
        })
        .catch(error => {
          bus.$emit("hide-ajax-loader");
        });
    },
    logout() {
      this.signOut()
        .then(data => {
          this.$router.replace({ name: "login-register" });
        })
        .catch(error => {});
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "~vue-material/theme/engine";
</style>
