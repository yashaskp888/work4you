const TOKEN_KEY = "work4you_token";
const ADMIN_KEY = "work4you_admin";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdmin(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, admin: object) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
