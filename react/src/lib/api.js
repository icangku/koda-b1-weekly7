const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  accessToken = null;
}

export async function refreshSession() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!refreshRes.ok) {
      accessToken = null;
      throw new Error("Refresh token expired");
    }

    const refreshData = await refreshRes.json();
    accessToken = refreshData.accessToken;
    return refreshData;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });

  if (
    response.status === 401 &&
    !options._retry &&
    !endpoint.includes("/api/auth/login") &&
    !endpoint.includes("/api/auth/register") &&
    !endpoint.includes("/api/auth/refresh")
  ) {
    try {
      const refreshData = await refreshSession();
      return apiFetch(endpoint, {
        ...options,
        _retry: true,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
      });
    } catch {
      clearSessionAndRedirect();
      throw new Error("Sesi telah berakhir, silakan login kembali.");
    }
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.error || data?.title || "Terjadi kesalahan pada sistem.";
    throw new Error(errorMsg);
  }

  return data;
}

function clearSessionAndRedirect() {
  accessToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
