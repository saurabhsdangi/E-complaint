import axios from "axios";

const instance = axios.create({
  baseURL: "https://e-complaint-jlce.onrender.com", // ✅ your deployed backend URL here
  withCredentials: false,
});

export default instance;
