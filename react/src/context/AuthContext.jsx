import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch, setAccessToken, clearAccessToken, refreshSession } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    refreshSession()
      .then((data) => {
        setAccessToken(data.accessToken);
        setUser(data.user);
      })
      .catch(() => {
        clearAccessToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (identifier, password) => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    setAccessToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload) => {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setAccessToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
    } finally {
      clearAccessToken();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    const data = await apiFetch("/api/auth/me");
    setUser(data);
    return data;
  };

  const isAdmin = user?.roles?.includes("ADMIN") ?? false;

  const hasPermission = (perm) => {
    return user?.permissions?.includes(perm) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        hasPermission,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
