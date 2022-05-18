import axios from "axios";

export default {
  namespaced: true,

  state: {
    overview: {
      total_attendance_in_today: ".",
      total_attendance_out_today: ".",
      totol_employees: ".",
      total_managers: ".",
    },
  },

  getters: {
    overview(state) {
      return state.overview;
    },
  },

  mutations: {
    SET_OVERVIEW(state, value) {
      state.overview = value;
    },
  },

  actions: {
    async getDashboardData({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/v1/overview")
          .then((response) => {
            const data = response.data;
            commit("SET_OVERVIEW", data);
            resolve(response);
          })
          .catch((error) => {
            console.error(error);
            commit("SET_OVERVIEW", {
              total_attendance_in_today: ".",
              total_attendance_out_today: ".",
              totol_employees: ".",
              total_managers: ".",
            });
            reject(error);
          });
      });
    },
  },
};
