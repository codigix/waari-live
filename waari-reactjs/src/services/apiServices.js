import axios from "axios";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

// Dynamically use backend URL based on environment
// Change this in .env files:
// VITE_WAARI_BASEURL=http://localhost:3000/api   (for development)
// VITE_WAARI_BASEURL=https://erp.travelwithwaari.com/api/api  (for production)
const url = import.meta.env.VITE_WAARI_BASEURL;

console.log("API Base URL:", url);

const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

const key = CryptoJS.enc.Utf8.parse("1234567890123456");
const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const clientcode = localStorage.getItem("clientcode");
  const encryptedData = encryptData(clientcode);

  if (token) {
    config.headers["token"] = token;
  }
  config.headers["clientcode"] = encryptedData || "";

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);

      if (Array.isArray(error.response.data.message)) {
        toast.error(error.response.data.message[0]);
      } else if (error.response.data.message) {
        toast.error(error.response.data.message);
      }

      if (error.response.status === 408) {
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("permissions");
          localStorage.removeItem("roleId");
          localStorage.removeItem("status");
          window.location.href = "/sales/login";
        }, 1000);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const get = async (url, params = {}, additionalHeaders = {}) => {
  try {
    const response = await api.get(url, {
      params,
      headers: { ...additionalHeaders },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const put = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const del = async (url) => {
  try {
    const response = await api.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};
