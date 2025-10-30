import axios from 'axios';
import { store } from '../store/store';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_FIREBASE_DB_URL || 'https://react-course-b798e-default-rtdb.firebaseio.com/',
});

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.auth?.idToken;

  config.params = config.params || {};

  // Attach token only if it exists
  if (token) {
    config.params['auth'] = token;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
