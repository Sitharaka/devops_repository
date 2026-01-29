import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Ensure any previously stored credentials in localStorage are cleared.
  useEffect(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    // Set default axios Authorization header for subsequent requests
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (e) {}
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      delete axios.defaults.headers.common['Authorization'];
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
