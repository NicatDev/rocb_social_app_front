import { message } from "antd";
import axios from "axios";

message.config({
  top: 100,
  duration: 3,
  maxCount: 5,
});
import API from "@/api";

axios.defaults.baseURL = "http://46.62.145.90:500/api/";
axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Accept-Language"] =
  localStorage.getItem("language") || import.meta.env.VITE_LANGUAGE;
axios.defaults.timeout = 60 * 1000;

let isRefreshing = false;
let failedRequests = [];

// --- REQUEST INTERCEPTOR ---
axios.interceptors.request.use(
  (req) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }
    return req;
  },
  (err) => {
    console.error("❌ Request interceptor error:", err);
    message.error("Request could not be sent. Please try again.");
    return Promise.reject(err);
  }
);

// --- RESPONSE INTERCEPTOR ---
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // status-u həm error.status-dan, həm də error.response.status-dan götür
    const status = error.status || error.response?.status;
    const backendMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message;

    // Əgər heç cavab yoxdursa → Network/CORS/Timeout
    if (!error.response) {
      if (error.message.includes("Network Error")) {
        console.error("🌍 Network Error:", error);
        message.error("Network error! Please check your internet connection.");
      } else if (error.code === "ECONNABORTED") {
        console.error("⏳ Timeout Error:", error);
        message.error("Request timed out. Please try again.");
      } else {
        console.error("⚠️ Unknown Error:", error);
        message.error("Unexpected error occurred.");
      }
      return Promise.reject(error);
    }

    switch (status) {
      case 400:
        message.error(backendMessage || "Bad Request (400)");
        console.error("❌ 400 Bad Request:", error.response);
        break;
      case 401:
        message.error(backendMessage || "Unauthorized (401)");
        break;
      case 403:
        message.error(backendMessage || "Forbidden (403)");
        console.error("🚫 403 Forbidden:", error.response);
        break;
      case 404:
        message.error(backendMessage || "Not Found (404)");
        console.error("🔍 404 Not Found:", error.response);
        break;
      case 500:
        message.error(backendMessage || "Server Error (500)");
        console.error("💥 500 Internal Server Error:", error.response);
        break;
      default:
        message.error(backendMessage || `Unexpected Error (${status})`);
        console.error(`⚠️ Unexpected Error ${status}:`, error.response);
        break;
    }

    // Refresh token prosesi
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequests.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh_token = sessionStorage.getItem("refreshToken");
      const token = localStorage.getItem("accessToken");
      if(refresh_token)
      return new Promise((resolve, reject) => {
        API.Auth.refreshToken({ token, refresh_token })
          .then(({ data }) => {
            const {
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
            } = data;

            localStorage.setItem("accessToken", newAccessToken);
            sessionStorage.setItem("refreshToken", newRefreshToken);

            axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            resolve(axios(originalRequest));
          })
          .catch((err) => {
            console.error("🔑 Refresh Token Failed:", err);
            localStorage.clear();
            window.location.href = "/login";
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      })
    }

    return Promise.reject(error);
  }
);

export default axios;
