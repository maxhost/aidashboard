import { apiFetch } from "./client";

export type Role = "operator" | "realtor";

export type User = {
  id: string;
  role: Role;
  email: string | null;
  phone: string | null;
  name: string | null;
  realtorId: string | null;
};

export type SignInResponse = {
  user: User;
  token: string;
  expires_at: string;
};

// Single sign-in for both roles. The backend resolves the user (and its role)
// by email, which is globally unique — the form doesn't pick a role.
export function signIn(
  email: string,
  password: string,
): Promise<SignInResponse> {
  return apiFetch<SignInResponse>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(token: string): Promise<{ user: User }> {
  return apiFetch<{ user: User }>("/auth/me", { token });
}

export function signOutRequest(token: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>("/auth/sign-out", { method: "POST", token });
}
