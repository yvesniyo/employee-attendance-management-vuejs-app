<template>
  <md-app-toolbar class="md-primary">
    <md-button class="md-icon-button" @click="$router.go(-1)">
      <md-icon>keyboard_arrow_left</md-icon>
    </md-button>
    <span class="md-title"></span>
  </md-app-toolbar>
</template>

<script>
export default {
  name: "dashboard-topbar",
  data: () => ({})
};
</script>

<style></style>
