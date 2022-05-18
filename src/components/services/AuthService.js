import axios from "axios";
import GlobalService from "./GlobalService";

class AuthService extends GlobalService {
  static URL_LOGIN = "/api/v1/auth/login";
  static URL_REGISTER = "/api/v1/auth/signup";
  static URL_LOGOUT = "/api/v1/auth/logout";
  static URL_ME = "/api/v1/auth/user";

  static async Login(credentials) {
    await this.Csrf();
    return axios.post(this.URL_LOGIN, credentials);
  }

  static async Logout() {
    await this.Csrf();
    return axios.post(this.URL_LOGOUT);
  }

  static async Register(data) {
    await this.Csrf();
    return axios.post(this.URL_REGISTER, data);
  }

  static async Me() {
    return axios.get(this.URL_ME);
  }
}

export default AuthService;
