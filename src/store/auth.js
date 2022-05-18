import axios from "axios";
import AuthService from "../components/services/AuthService";
import { reloadApiToken } from "../utilty/helpers";

export default {
  namespaced: true,

  state: {
    authenticated: false,
    user: null,
    token: null,
  },

  getters: {
    authenticated(state) {
      return state.authenticated;
    },

    user(state) {
      return state.user;
    },
  },

  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.authenticated = value;
    },

    SET_USER(state, value) {
      try {
        state.user = value.user;
        state.token = value.token;
      } catch (error) {
        console.log(error);
      }
    },
  },

  actions: {
    async sendResetLink({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("api/v1/auth/requestResetLink", data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    async signIn({ dispatch, commit }, credentials) {
      return new Promise((resolve, reject) => {
        AuthService.Login(credentials)
          .then((response) => {
            commit("SET_AUTHENTICATED", true);
            const data = response.data.data;
            commit("SET_USER", data);
            localStorage.setItem("currentUser", data);
            localStorage.setItem("member_token", data.token);
            reloadApiToken();
            resolve(response);
          })
          .catch((error) => {
            dispatch("me");
            reloadApiToken();
            reject(error);
          });
      });
    },

    async register({ dispatch }, data) {
      return AuthService.Register(data);
    },

    async signOut({ dispatch, commit }) {
      const logout = await AuthService.Logout();

      commit("SET_AUTHENTICATED", false);
      commit("SET_USER", {
        user: null,
        token: null,
      });
      localStorage.setItem("currentUser", null);
      reloadApiToken();

      return dispatch("me");
    },

    async getNewCode({ dispatch }) {
      await AuthService.GetNewCode();
      return dispatch("me");
    },

    async me({ commit }) {
      return new Promise((resolve, reject) => {
        AuthService.Me()
          .then((response) => {
            commit("SET_AUTHENTICATED", true);
            commit("SET_USER", {
              user: response.data,
              token: localStorage.getItem("member_token"),
            });
            reloadApiToken();
            resolve(response);
          })
          .catch((error) => {
            commit("SET_AUTHENTICATED", false);
            commit("SET_USER", null);
            localStorage.setItem("currentUser", null);
            localStorage.setItem("member_token", null);
            reloadApiToken();
            reject(error);
          });
      });
    },
  },
};
