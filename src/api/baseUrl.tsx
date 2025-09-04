import axios from "axios";

export const baseUrl = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
