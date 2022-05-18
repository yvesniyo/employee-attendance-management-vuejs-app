import GlobalService from "./GlobalService";
import axios from "axios";

class WalletService extends GlobalService {
  static async Topup(phone, amount) {
    const data = {
      phone,
      amount
    };
    return axios.post(this.API_URL_PARTICIPANT + "wallet/topup", data);
  }

  static async Withdraw(phone, amount) {
    const data = {
      phone,
      amount
    };
    return axios.post(this.API_URL_PARTICIPANT + "wallet/withdraw", data);
  }

  static async SendMoney(phone, amount) {
    const data = {
      phone,
      amount
    };
    return axios.post(this.API_URL_PARTICIPANT + "wallet/send-money", data);
  }
}

export default WalletService;
