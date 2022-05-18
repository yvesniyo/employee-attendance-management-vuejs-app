import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import managerDashboard from "./managerDashboard";
import employees from "./employees";
import attendance from "./attendance";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    managerDashboard,
    employees,
    attendance,
  },
});
