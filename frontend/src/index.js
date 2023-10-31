import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./components/common/auth/AuthProvider";
import { CommunicationProvider } from "./components/common/communication/CommunicationProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CommunicationProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </CommunicationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
