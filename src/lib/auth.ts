const TOKEN_KEY = "artifex_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const headers = { ...init.headers, ...getAuthHeaders(), "Content-Type": "application/json" };
  const res = await fetch(`${apiBase}${input}`, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    throw new Error("Unauthorized");
  }
  return res;
}
