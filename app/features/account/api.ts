import { apiClient } from "~/lib/api/client";
import type { UserProfile, UpdateUserPasswordRequest, UpdateUserEmailRequest } from "./types";

export function getUserProfile() {
  return apiClient.get<UserProfile>(
    "/api/users/me"
  )
}

export function updateUserEmail(params: UpdateUserEmailRequest) {
  return apiClient.patch<UserProfile>(
    "/api/users/me",
    params
  )
}

export function updateUserPassword(params: UpdateUserPasswordRequest) {
  return apiClient.patch(
    "/api/users/me/password",
    params
  )
}

export function deleteUser() {
  return apiClient.delete(
    "/api/users/me"
  )
}
