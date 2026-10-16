import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginWithApi,
  clearAuthToken,
  getStoredToken,
  getStoredUser,
  setAuthExpiredHandler,
} from "../services/apiClient";

import {
  registerUser,
  getDatabaseUsers,
  checkCrudAccess,
  CRUD_AUTHORIZED_EMAIL,
} from "../services/userDatabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [expiredNotice, setExpiredNotice] = useState(null);

  // Handle invalid or expired token caught by Axios Interceptor
  useEffect(() => {
    setAuthExpiredHandler((notice) => {
      setToken(null);
      setUser(null);
      setExpiredNotice(notice.message || "Your session has expired. Please log in again.");
    });
  }, []);

  // Authenticate user against persistent database
  const login = async (usernameOrUser, password) => {
    setIsLoading(true);
    setAuthError(null);
    setExpiredNotice(null);

    try {
      let username = "";
      let pass = password || "";

      if (typeof usernameOrUser === "string") {
        username = usernameOrUser;
      } else if (usernameOrUser && typeof usernameOrUser === "object") {
        username = usernameOrUser.email || usernameOrUser.username || usernameOrUser.name || "";
        pass = usernameOrUser.password || pass;
      }

      const data = await loginWithApi({ username, password: pass });

      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register new customer in database and log in
  const register = async ({ name, email, password }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const newUser = registerUser({ name, email, password });
      return await login(newUser.email, password);
    } catch (err) {
      setAuthError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout and remove token
  const logout = () => {
    clearAuthToken();
    setToken(null);
    setUser(null);
    setExpiredNotice(null);
  };

  // Method to simulate expired token
  const simulateExpireToken = () => {
    localStorage.setItem("novastore_auth_token", "invalid_expired_token_mock");
    setToken("invalid_expired_token_mock");
    setExpiredNotice("Token has been manually invalidated for testing!");
  };

  const isCrudAuthorized = checkCrudAccess(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isCrudAuthorized,
        crudAuthorizedEmail: CRUD_AUTHORIZED_EMAIL,
        isLoading,
        authError,
        expiredNotice,
        setExpiredNotice,
        login,
        register,
        logout,
        simulateExpireToken,
        getDatabaseUsers,
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

