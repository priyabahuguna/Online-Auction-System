import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken]=useState(null);

  const login = (token) => {
    // Perform login logic (e.g., authenticate user with backend)
    setIsAuthenticated(true);
    setAuthToken(token);
  };

  const logout = () => {
    // Perform logout logic (e.g., clear authentication token)
    setIsAuthenticated(false);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
