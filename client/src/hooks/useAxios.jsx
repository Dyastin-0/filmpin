import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const useAxios = () => {
  const { token, setToken } = useAuth();

  api.interceptors.request.use(
    async (config) => {
			const decodedAccessToken = jwtDecode(token);
			const isExpired = dayjs.unix(decodedAccessToken.exp).diff(dayjs()) < 1;
			if (!isExpired) {
				config.headers.Authorization = `Bearer ${token}`;
				return config;
			}

			const response = await axios.get('/refreshAccessToken');
			setToken(response.data.accessToken);
			config.headers.Authorization = `Bearer ${response.data.accessToken}`;

      return config;
    },
    async (error) => Promise.reject(error)
  );

  return api;
};

export default useAxios;
