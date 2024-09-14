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

const queryClient = new QueryClient();

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
