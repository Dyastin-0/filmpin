import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const useAxios = () => {
  const { token, setToken } = useAuth();
  const [isAxiosReady, setIsAxiosReady] = useState(false);

  useEffect(() => {
    if (token) {
      const interceptor = api.interceptors.request.use(
        async (config) => {
          const decodedAccessToken = jwtDecode(token);
          const isExpired = dayjs.unix(decodedAccessToken.exp).diff(dayjs()) < 1;
  
          if (!isExpired) {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          }

          const response = await axios.get('/refreshAccessToken', {
            withCredentials: true,
          });
          setToken(response.data.accessToken);
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return config;
        },
        (error) => Promise.reject(error)
      );
      
      setIsAxiosReady(true);  // Axios is now ready with the interceptor
      return () => api.interceptors.request.eject(interceptor);  // Cleanup interceptor
    }
  }, [token, setToken]);

  return { api, isAxiosReady };
};

export default useAxios;