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
  const expectedEmail = (import.meta.env.VITE_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? "";
  if (!expectedEmail || !expectedPassword) return false;
  return email.trim().toLowerCase() === expectedEmail && password === expectedPassword;
}
