import { apiClient } from "~/lib/api/client";
import { tokenStorage } from "~/lib/api/token";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  user: {
    id: number;
    email: string;
    role: "user" | "admin";
  };
};

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
