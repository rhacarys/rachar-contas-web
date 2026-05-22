import { api } from "../api/client";
import { type LoginRequest, type LoginResponse, type RegisterRequest } from "../models/Schemas";

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterRequest) => {
    await api.post("/auth/register", data);
  },
};
