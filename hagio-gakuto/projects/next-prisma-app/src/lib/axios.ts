import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Set a timeout for requests
  withCredentials: true,
});

export default api;
