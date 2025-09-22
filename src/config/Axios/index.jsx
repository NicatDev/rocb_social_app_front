import { message } from "antd";
import axios from "axios";
import API from "@/api";

message.config({
  top: 100,
  duration: 3,
  maxCount: 5,
});

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
  (err) => Promise.reject(err)
);

// --- RESPONSE INTERCEPTOR ---
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Refresh prosesi
    if (status === 403 && !originalRequest._retry) {
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

      const refresh_token = localStorage.getItem("refreshToken");
      const token = localStorage.getItem("accessToken");

      if (!refresh_token) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        API.Auth.refreshToken({ token, refresh_token })
          .then(({ data }) => {
            const {
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
            } = data;

            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // pending requestləri burda resolve elə
            failedRequests.forEach((req) => req.resolve(newAccessToken));
            failedRequests = [];

            resolve(axios(originalRequest));
          })
          .catch((err) => {
            console.error("🔑 Refresh Token Failed:", err);
            localStorage.clear();
            window.location.href = "/login";
            failedRequests.forEach((req) => req.reject(err));
            failedRequests = [];
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default axios;
