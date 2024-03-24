import axios from "axios";

const API_URL = "http://localhost:3001/";

class AuthService {
  login(username, password) {
    return axios.post(API_URL + "login", { username, password });
  }

  register(username, password) {
    return axios.post(API_URL + "register", { username, password });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
