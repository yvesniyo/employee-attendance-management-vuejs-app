<template>
  <div class="page-container">
    <md-app md-mode="reveal">
      <DashboardTopbar></DashboardTopbar>

      <md-app-content>
        <p>Content</p>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import DashboardTopbar from "../../common/dashboard-topbar.vue";
export default {
  components: { DashboardTopbar },
  name: "view-profile",
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.md-app {
  min-height: 100vh;
}
</style>
