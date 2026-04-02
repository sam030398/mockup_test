import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { EmissionsProvider } from "./context/EmissionsContext";
import "./styles.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EmissionsProvider>
          <App />
        </EmissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
