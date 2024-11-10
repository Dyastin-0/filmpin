import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { SWRConfig } from "swr";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ModalProvider } from "./components/hooks/useModal.jsx";
import { ToastProvider } from "./components/hooks/useToast.jsx";
import { ListProvider } from "./hooks/useList.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <ToastProvider>
        <ModalProvider>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              revalidateIfStale: true,
              revalidateOnReconnect: true,
            }}
          >
            <ListProvider>
              <App />
            </ListProvider>
          </SWRConfig>
        </ModalProvider>
      </ToastProvider>
    </BrowserRouter>
  </AuthProvider>
);
