import { ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD } from "../config/adminCredentials";

const STORAGE_KEY = "elite_admin_session";

export type AdminSession = {
  email: string;
  loggedInAt: string;
};

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function setAdminSession(session: AdminSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminSession());
}

export function validateAdminCredentials(email: string, password: string): boolean {
  const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const envPass = import.meta.env.VITE_ADMIN_PASSWORD;
  const expectedEmail = (
    typeof envEmail === "string" && envEmail.trim() !== "" ? envEmail.trim() : ADMIN_DEFAULT_EMAIL
  ).toLowerCase();
  const expectedPassword =
    typeof envPass === "string" && envPass !== "" ? envPass : ADMIN_DEFAULT_PASSWORD;
  return email.trim().toLowerCase() === expectedEmail && password === expectedPassword;
}
