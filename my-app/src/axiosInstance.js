import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach the token to headers
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token; // Attach the token without 'Bearer ' prefix
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Example function to handle login and store the token
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials); // Replace with your login endpoint
    localStorage.setItem('token', `Bearer ${response.data.token}`); // Store the token with 'Bearer ' prefix
  } catch (error) {
    console.error('Login failed', error);
  }
};

export default axiosInstance;
