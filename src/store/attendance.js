import axios from "axios";

export default {
  namespaced: true,

  state: {
    attendances: [],
  },

  getters: {
    attendances(state) {
      return state.attendances;
    },
  },

  mutations: {
    SET_ATTENDANCES(state, value) {
      state.attendances = value;
    },
  },

  actions: {
    async fetchAttendances({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .get("api/v1/get-attendances?from=" + data.from + "&to=" + data.to)
          .then((response) => {
            commit("SET_ATTENDANCES", response.data.data);
            resolve(response);
          })
          .catch((error) => {
            commit("SET_ATTENDANCES", []);
            reject(error);
          });
      });
    },
    async exportAttendances({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        axios
          .get("api/v1/exportAttendance?from=" + data.from + "&to=" + data.to)
          .then((response) => {
            resolve(response.data.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
