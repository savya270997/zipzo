import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("appforall_token");
      const legacyToken = localStorage.getItem("zipzo_token");

      if (!token && !legacyToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        localStorage.removeItem("appforall_token");
        localStorage.removeItem("zipzo_token");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload, mode = "login") => {
    const { data } = await api.post(`/auth/${mode}`, payload);
    localStorage.setItem("zipzo_token", data.token);
    localStorage.removeItem("appforall_token");
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("appforall_token");
    localStorage.removeItem("zipzo_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      loading,
      isAuthenticated: Boolean(user)
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
