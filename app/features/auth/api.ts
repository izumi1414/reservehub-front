import { apiClient } from "~/lib/api/client";
import { tokenStorage } from "~/lib/api/token";
import type { AuthUser } from "./types";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
};

type RegisterResponse = {
  id: string;
  email: string;
}

export async function login(
  params: LoginRequest
) {
  const response = await apiClient.post<LoginResponse>(
    "/api/auth/login",
    params,
    false
  );

  tokenStorage.set(response.accessToken);

  return response;
}

export function logout(): void {
  tokenStorage.remove();
}

export async function register(
  params: LoginRequest
) {
  const response = await apiClient.post<RegisterResponse>(
    "/api/auth/register",
    params,
    false
  );

  return response;
}

export async function getCurrentUser() {
  return apiClient.get<AuthUser>("/api/users/me");
}
