export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface UpdateUserEmailRequest {
  email: string;
}

export interface UpdateUserPasswordRequest {
  currentPassword: string;
  newPassword: string;
}
