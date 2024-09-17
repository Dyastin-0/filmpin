import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ModalProvider } from './components/hooks/useModal.jsx';
import { ToastProvider } from './components/hooks/useToast.jsx';
import { LoadingProvider } from './components/hooks/useLoading.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import localforage from 'localforage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 1,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});


const loadCache = async () => {
  try {
    const cachedData = await localforage.getItem('react-query-cache');
    if (cachedData) {
      cachedData.forEach(({ queryKey, data }) => {
        queryClient.setQueryData(queryKey, data);
      });
    }
  } catch (err) {
    console.error('Failed to load cache', err);
  }
};

const saveCache = () => {
  const cache = queryClient.getQueryCache().getAll();
  const cacheToSave = cache.map(({ queryKey, state }) => ({
    queryKey,
    data: state.data,
  }));
  localforage.setItem('react-query-cache', cacheToSave).catch(err => {
    console.error('Failed to save cache', err);
  });
};

loadCache();

queryClient.getQueryCache().subscribe(() => {
  saveCache();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <ToastProvider>
        <ModalProvider>
          <LoadingProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </LoadingProvider>
        </ModalProvider>
      </ToastProvider>
    </BrowserRouter>
  </AuthProvider>
);
