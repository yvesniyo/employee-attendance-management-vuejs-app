import axios from "axios";

class GlobalService {
  static getBaseUrl() {
    return process.env.VUE_APP_API_BASE_URL;
  }

  static async Csrf() {
    return axios.get("/sanctum/csrf-cookie");
  }
}

export default GlobalService;
