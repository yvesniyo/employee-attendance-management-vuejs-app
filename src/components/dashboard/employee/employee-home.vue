<template>
  <div class="dashboard">
    <md-app md-waterfall md-moe="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button
              class="md-icon-button"
              @click="menuVisible = !menuVisible"
            >
              <md-icon>menu</md-icon>
            </md-button>

            <span class="md-title">Dashboard</span>
          </div>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
          </div>
        </div>

        <div class="md-toolbar-row">
          <md-tabs class="md-primary">
            <md-tab
              id="tab-home"
              :to="{ name: 'dashboard' }"
              md-label="Home"
            ></md-tab>
            <md-tab
              id="tab-pages"
              :to="{ name: 'all-cooperatives' }"
              md-label="ASSOC"
            ></md-tab>
            <md-tab
              id="tab-people"
              :to="{ name: 'all-people' }"
              md-label="People"
            ></md-tab>
            <md-tab
              id="tab-posts"
              :to="{ name: 'my-account' }"
              md-label="Account"
            ></md-tab>
          </md-tabs>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          {{ $t("app_name") }}
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>dashboard</md-icon>
            <span class="md-list-item-text">Dashboard</span>
          </md-list-item>

          <md-list-item @click="logout()">
            <md-icon>logout</md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content class="pt-0 bg-light app-content">
        <div class="row">
          <div class="col-md-12 p-0">
            <AjaxLoader> </AjaxLoader>
          </div>
        </div>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AjaxLoader from "../../common/ajax-loader.vue";

export default {
  components: { AjaxLoader },
  name: "dashboard",
  data: () => ({
    menuVisible: false
  }),
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user"
    })
  },
  mounted() {
    if (this.authenticated) {
      this.$echo
        .channel("wallet." + this.user.id)
        .listen(".topup.success", payload => {
          this.$notify({
            title: this.$t("Topup"),
            message: payload.message,
            type: "success",
            duration: 0
          });
        });

      this.$echo
        .channel("wallet." + this.user.id)
        .listen(".topup.error", payload => {
          this.$notify({
            title: this.$t("Topup"),
            message: payload.message,
            type: "error",
            duration: 0
          });
        });
    }
  },
  methods: {
    ...mapActions({
      signOut: "auth/signOut"
    }),
    logout: function() {
      const loading = this.$loading({
        lock: true,
        text: this.$t("Logging out..."),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      this.signOut()
        .then(data => {
          loading.close();
          this.$router.replace({ name: "login-register" });
        })
        .catch(error => {
          loading.close();
        });
    }
  },
  created() {
    if (!this.authenticated) {
      this.$router.replace({
        name: "login"
      });
    }
  }
};
</script>

<style lang="scss">
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
div.dashboard {
  height: 100vh !important;
  overflow-y: scroll;
  position: relative;
}
.app-content {
  height: calc(100vh - 114px) !important;
  background-color: red !important;
  overflow: auto;
}
</style>
