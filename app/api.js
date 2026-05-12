import { create } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { baseURL } from "./config.js";

const api = create({
  baseURL: baseURL,
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  async (config) => {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`, config.params || "", config.data || "");
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    console.error(`❌ API Error: ${error.config?.method.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    if (error.response && error.response.status === 401) {
      // Clear secure storage and redirect to login if unauthorized
      await SecureStore.deleteItemAsync("token");
      router.replace("/(auth)/Login");
    }
    return Promise.reject(error);
  }
);

export default api;
