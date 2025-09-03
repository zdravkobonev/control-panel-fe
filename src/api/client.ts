// src/api/client.ts
import axios from "axios";
import { getToken, clearToken } from "../lib/auth";
// централен axios client, който го прави сам, добавя токена в Authorization: Bearer ... header.

// axios инстанция с базовия URL от .env
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// всеки път, преди да тръгне заявката
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ако бекендът върне 401 → чистим токена и пращаме към /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
