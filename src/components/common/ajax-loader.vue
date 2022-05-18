<template>
  <div v-if="requestCount" class="p-0 m-0" style="height: 5px">
    <md-progress-bar class="md-primary" md-mode="query"></md-progress-bar>
  </div>
</template>

<script>
import { bus } from "@/plugins/bus.js";
export default {
  name: "ajax-loader",

  data() {
    return {
      requestCount: 0
    };
  },

  created() {
    var this_this = this;

    bus.$on("show-ajax-loader", function() {
      this_this.requestCount++;
    });

    bus.$on("hide-ajax-loader", function() {
      if (this_this.requestCount) this_this.requestCount--;
    });

    bus.$on("destroy-ajax-loader", function() {
      this_this.requestCount = 0;
    });
  }
};
</script>

<style scoped lang="scss"></style>
