import { apiFetch } from "./client";

export type UserListItem = {
  id: string;
  role: "operator" | "realtor";
  name: string | null;
  email: string | null;
  phone: string | null;
  realtor_id: string | null;
  created_at: string;
};

export function listUsers(
  token: string,
  role?: "operator" | "realtor",
): Promise<{ items: UserListItem[] }> {
  const q = role ? `?role=${role}` : "";
  return apiFetch<{ items: UserListItem[] }>(`/operator/users${q}`, { token });
}

export type CreateRealtorBody = {
  role: "realtor";
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type CreateOperatorBody = {
  role: "operator";
  name: string;
  email: string;
  password: string;
};

export function createUser(
  token: string,
  body: CreateRealtorBody | CreateOperatorBody,
): Promise<{ ok: true; user: UserListItem }> {
  return apiFetch(`/operator/users`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}
