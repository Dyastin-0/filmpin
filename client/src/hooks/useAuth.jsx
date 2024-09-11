import React, { useEffect, useState, useContext, createContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [signingIn, setSigningIn] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get('/refreshAccessToken');
        setToken(response.data.accessToken);
        setUser(response.data.user);
        setSigningIn(false);
      } catch (error) {
        console.error(error);
        setToken(null);
        setSigningIn(false);
      }
    }
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      const randomId = crypto.randomUUID();
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: {
          Authorization: `Bearer ${token}`
        },
        query: {
          randomId: randomId,
          targetStream: 'user',
        }
      });

      newSocket.on(`stream/user/${user._id}/${randomId}`, (change) => {
        if (change.type === 'delete') {
          setToken(null);
          setUser(null);
        } else {
          const newList = change.affectedFields.lists;
          if (newList) {
            user.lists = newList;
            setUser(user);
          }
        }
      });
      return () => newSocket.disconnect();
    }
  }, [token, user]);

  const value = {
    token,
    user,
    setUser,
    setToken,
    signingIn
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}