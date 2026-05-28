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
  isDemoMode,
  saveSession,
  setDemoMode,
} from "./session";

export type { User } from "./api/auth";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(getToken()) || isDemoMode();
}

export function getCurrentUser(): User | null {
  return getCachedUser();
}

export function isDemoSession(): boolean {
  return isDemoMode();
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const { user, token } = await signInOperator(email, password);
  saveSession(token, user);
  return user;
}

export async function signInWithPhone(phone: string, password: string): Promise<User> {
  const { user, token } = await signInRealtor(phone, password);
  saveSession(token, user);
  return user;
}

export function signInAsDemo(): void {
  setDemoMode();
}

/** Backwards-compat alias used by the onboarding setup flow. */
export const signIn = signInAsDemo;

export async function signOut(): Promise<void> {
  const token = getToken();
  if (token) {
    try {
      await signOutRequest(token);
    } catch {
      // ignore network error on sign-out; clear local state regardless
    }
  }
  clearSession();
}
