import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginApi, registerApi } from "../services/authApi";

// Valeur par défaut pour le contexte
const defaultAuthValue = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loadUser: async () => {},
};

const AuthContext = createContext(defaultAuthValue);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const data = await getMe();

      // Le backend renvoie : { user: {...}, profile: {...} }
      setUser(data.user);
      setRole(data.user.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur loadUser", error);
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    const data = await loginApi(credentials);
    // Le backend renvoie : { user, access, refresh }
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    setUser(data.user);
    setRole(data.user.role);
    setIsAuthenticated(true);

    return data;
  }

  async function register(payload) {
    const data = await registerApi(payload);
    // Le backend renvoie : { id, username, role, access, refresh }
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    setUser({
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    });

    setRole(data.role);
    setIsAuthenticated(true);

    return data;
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  }

  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Le contexte ne sera jamais null maintenant car on a une valeur par défaut
  return context;
}
