import GlobalService from "./GlobalService";
import axios from "axios";

class EmployeeService extends GlobalService {
  static URL_EMPLOYEES = "/api/v1/employees/";

  static async CreateEmployee(data) {
    return axios.post(this.URL_EMPLOYEES, data);
  }

  static async UpdateEmployee(data) {
    return axios.patch(this.URL_EMPLOYEES + data.code + "/update", data);
  }

  static async ViewEmployee(employee_id) {
    return axios.get(this.URL_EMPLOYEES + "get-employee/" + employee_id);
  }

  static async SearchEmployees(query) {
    return axios.get(this.URL_EMPLOYEES + "search" + query);
  }

  static async Employees() {
    return axios.get(this.URL_EMPLOYEES);
  }

  static async DeleteEmployee(employee_code) {
    return axios.delete(this.URL_EMPLOYEES + employee_code + "/delete");
  }

  static async MarkAttendace(data) {
    return axios.post(this.URL_EMPLOYEES + "registerAttendance", data);
  }
}

export default EmployeeService;
