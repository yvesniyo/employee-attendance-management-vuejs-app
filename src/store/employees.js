import EmployeeService from "../components/services/EmployeeService";
import axios from "axios";

export default {
  namespaced: true,

  state: {
    employees: [],
    currentEmployee: {}
  },

  getters: {
    employees(state) {
      return state.employees;
    },
    currentEmployee(state) {
      return state.currentEmployee;
    }
  },

  mutations: {
    SET_EMPLOYEES(state, value) {
      state.employees = value;
    },
    PUSH_EMPLOYEES(state, value) {
      state.employees.push(...value);
    },
    SET_CURRENT_EMPLOYEE(state, value) {
      state.currentEmployee = value;
    }
  },

  actions: {
    async getEmployee({ commit, dispatch }, employee_id) {
      return new Promise((resolve, reject) => {
        EmployeeService.ViewEmployee(employee_id)
          .then(response => {
            commit("SET_CURRENT_EMPLOYEE", response.data.data);
            resolve(response);
          })
          .catch(error => {
            commit("SET_CURRENT_EMPLOYEE", {});
            reject(error);
          });
      });
    },

    async createEmployee({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        EmployeeService.CreateEmployee(data)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    async updateEmployee({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        EmployeeService.UpdateEmployee(data)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    async deleteEmployee({ commit }, employee_code) {
      return new Promise((resolve, reject) => {
        EmployeeService.DeleteEmployee(employee_code)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    async markAttendance({ commit }, data) {
      return new Promise((resolve, reject) => {
        EmployeeService.MarkAttendace(data)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    async employees({ commit }) {
      return new Promise((resolve, reject) => {
        EmployeeService.Employees()
          .then(response => {
            commit("SET_EMPLOYEES", response.data);
            resolve(response);
          })
          .catch(error => {
            commit("SET_EMPLOYEES", []);
            reject(error);
          });
      });
    },

    async search({ commit }, data) {
      let query = "?" + data.searchFilter + "=" + data.search;
      query += "&limit=" + data.limit;
      query += "&page=" + data.page;

      console.log(data);
      return new Promise((resolve, reject) => {
        EmployeeService.SearchEmployees(query)
          .then(response => {
            commit("SET_EMPLOYEES", response.data);

            resolve(response);
          })
          .catch(error => {
            commit("SET_EMPLOYEES", []);
            reject(error);
          });
      });
    }
  }
};
