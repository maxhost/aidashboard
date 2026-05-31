"use client";

import {
  signInOperator,
  signInRealtor,
  signOutRequest,
  type User,
} from "./api/auth";
import {
  clearSession,
  getCachedUser,
  getToken,
  saveSession,
} from "./session";

export type { User } from "./api/auth";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(getToken());
}

export function getCurrentUser(): User | null {
  return getCachedUser();
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const { user, token } = await signInOperator(email, password);
  saveSession(token, user);
  return user;
}

export async function signInRealtorWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const { user, token } = await signInRealtor(email, password);
  saveSession(token, user);
  return user;
}

/**
 * Client-side sign-out. Clears local session and best-effort revokes the
 * server token. Redirects to /login afterwards so middleware/AuthGate kicks
 * back to the sign-in screen.
 */
export async function signOut(): Promise<void> {
  const token = getToken();
  if (token) {
    try {
      await signOutRequest(token);
    } catch {
      // ignore — local session is cleared regardless
    }
  }
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
