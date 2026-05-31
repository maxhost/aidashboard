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

export function signInOperator(
  email: string,
  password: string,
): Promise<SignInResponse> {
  return apiFetch<SignInResponse>("/auth/operator/sign-in", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signInRealtor(
  email: string,
  password: string,
): Promise<SignInResponse> {
  return apiFetch<SignInResponse>("/auth/realtor/sign-in", {
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
