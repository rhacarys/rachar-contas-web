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
    if (!error.response && error.message === "Network Error") {
      console.debug("Dispositivo offline. O TanStack Query gerenciará a fila.");
      return Promise.reject(error);
    }

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
    } else if (error.response && error.response.status >= 500) {
      notifications.show({
        title: "Erro no servidor",
        message: "Tivemos um problema inesperado. Tente novamente mais tarde.",
        color: "red",
        autoClose: 4000,
      });
    }

    return Promise.reject(error);
  },
);
