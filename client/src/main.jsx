import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { SWRConfig } from "swr";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ModalProvider } from "./components/hooks/useModal.jsx";
import { ToastProvider } from "./components/hooks/useToast.jsx";
import { LoadingProvider } from "./components/hooks/useLoading.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <ToastProvider>
        <ModalProvider>
          <LoadingProvider>
            <SWRConfig
              value={{
                revalidateOnFocus: false,
                // shouldRetryOnError: true,
                // revalidateOnMount: false,
                revalidateIfStale: true,
                revalidateOnReconnect: true,
              }}
            >
              <App />
            </SWRConfig>
          </LoadingProvider>
        </ModalProvider>
      </ToastProvider>
    </BrowserRouter>
  </AuthProvider>
);
