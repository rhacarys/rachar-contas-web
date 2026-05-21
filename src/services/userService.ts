import { api } from "../api/client";
import { type UserResponse, type UserUpdateRequest } from "../models/Schemas";

export const userService = {
  getMe: async (): Promise<UserResponse> => {
    // TODO: Implement GET /me endpoint
    const response = await api.get<UserResponse>("/users/me");
    return response.data;
  },
  updateMe: async (data: UserUpdateRequest): Promise<UserResponse> => {
    const response = await api.put<UserResponse>("/users/me", data);
    return response.data;
  },
  deleteMe: async (): Promise<void> => {
    await api.delete("/users/me");
  },
};
