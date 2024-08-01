// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Your backend URL
  withCredentials: true, // Include credentials (cookies) in requests
});

export default axiosInstance;
