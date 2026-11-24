const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = localStorage.getItem("accessToken");
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && !options._retry && !endpoint.includes("/api/auth/login") && !endpoint.includes("/api/auth/refresh")) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      clearSessionAndRedirect();
      throw new Error("Sesi telah berakhir, silakan login kembali.");
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!newToken) return reject(new Error("Gagal memperbarui token."));
          options._retry = true;
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          };
          resolve(apiFetch(endpoint, options));
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        throw new Error("Refresh token expired");
      }

      const refreshData = await refreshRes.json();
      localStorage.setItem("accessToken", refreshData.accessToken);
      localStorage.setItem("refreshToken", refreshData.refreshToken);
      isRefreshing = false;
      onRefreshed(refreshData.accessToken);

      options._retry = true;
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${refreshData.accessToken}`,
      };
      return apiFetch(endpoint, options);
    } catch (err) {
      isRefreshing = false;
      onRefreshed(null);
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
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
