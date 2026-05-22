import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const hasToken = !!useAuthStore.getState().token;
      if (hasToken) {
        useAuthStore.getState().logout();
        notifications.show({
          title: "Sessão expirada",
          message: "Sua conexão de segurança expirou. Por favor, faça login novamente.",
          color: "blue",
          autoClose: 5000,
        });
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
