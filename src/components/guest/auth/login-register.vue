<template>
  <div class="page-container">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <span class="md-title">{{ $t("app_name") }}</span>
      </md-app-toolbar>

      <md-app-content>
        <div class="row">
          <div class="col-md-12 mt-5 mb-5">
            <h1>Logo</h1>
          </div>
          <div class="col-md-12 mt-5">
            <md-button
              :to="{ name: 'login' }"
              class="border border-light"
              style="flex: 1"
              >{{ $t("Login") }}</md-button
            >
            <md-button :to="{ name: 'register' }" class="md-raised md-primary">
              {{ $t("Register") }}
            </md-button>
          </div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: "login-register"
};
</script>

<style></style>
