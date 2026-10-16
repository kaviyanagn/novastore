import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginWithApi,
  clearAuthToken,
  getStoredToken,
  getStoredUser,
  setAuthExpiredHandler,
} from "../services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [expiredNotice, setExpiredNotice] = useState(null);

  // Requirement g: Handle invalid or expired token caught by Axios Interceptor
  useEffect(() => {
    setAuthExpiredHandler((notice) => {
      setToken(null);
      setUser(null);
      setExpiredNotice(notice.message || "Your session has expired. Please log in again.");
    });
  }, []);

  // Requirement a & b: Login via API and store token
  const login = async (usernameOrUser, password) => {
    setIsLoading(true);
    setAuthError(null);
    setExpiredNotice(null);

    try {
      let username = "alex.morgan@novastore.com";
      let pass = password || "password123";

      if (typeof usernameOrUser === "string") {
        username = usernameOrUser;
      } else if (usernameOrUser && typeof usernameOrUser === "object") {
        username = usernameOrUser.email || usernameOrUser.username || usernameOrUser.name || username;
        pass = usernameOrUser.password || pass;
      }

      const data = await loginWithApi({ username, password: pass });

      const finalUser =
        usernameOrUser && typeof usernameOrUser === "object"
          ? { ...data.user, ...usernameOrUser }
          : data.user;

      setToken(data.token);
      setUser(finalUser);
      localStorage.setItem("novastore_auth_user", JSON.stringify(finalUser));
      return { token: data.token, user: finalUser };
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Requirement f: Logout and remove token
  const logout = () => {
    clearAuthToken();
    setToken(null);
    setUser(null);
    setExpiredNotice(null);
  };

  // Requirement g: Method to simulate expired token
  const simulateExpireToken = () => {
    localStorage.setItem("novastore_auth_token", "invalid_expired_token_mock");
    setToken("invalid_expired_token_mock");
    setExpiredNotice("Token has been manually invalidated for testing!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        authError,
        expiredNotice,
        setExpiredNotice,
        login,
        logout,
        simulateExpireToken,
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

