import axios from 'axios';
import React, { useEffect, useState, useContext, createContext, useLayoutEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useLayoutEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get('/refreshAccessToken');
        setToken(response.data.accessToken);
        setUser(response.data.user);
      } catch (error) {
        setToken(null);
      }
    }
    getToken();
  }, []);

  const value = {
    token,
    user,
    setUser,
    setToken
  }
  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}