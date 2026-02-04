"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken } from "../lib/api";

interface User { id: string; email: string; name?: string; role?: string }

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("ssc_token");
    const u = localStorage.getItem("ssc_user");
    if (t) {
      setToken(t);
      setAuthToken(t);
    }
    if (u) setUser(JSON.parse(u));
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post("/api/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("ssc_token", token);
    localStorage.setItem("ssc_user", JSON.stringify(user));
    setAuthToken(token);
    setToken(token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem("ssc_token");
    localStorage.removeItem("ssc_user");
    setAuthToken(undefined);
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
