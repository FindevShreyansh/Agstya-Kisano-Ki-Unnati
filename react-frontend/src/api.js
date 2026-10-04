const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export function getToken() {
  return localStorage.getItem("agstya_token");
}

export function clearSession() {
  localStorage.removeItem("agstya_token");
  localStorage.removeItem("agstya_user");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function login(credentials) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });
  localStorage.setItem("agstya_token", data.token);
  localStorage.setItem("agstya_user", JSON.stringify(data));
  return data;
}

export async function register(user) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: user,
  });
  localStorage.setItem("agstya_token", data.token);
  localStorage.setItem("agstya_user", JSON.stringify(data));
  return data;
}
