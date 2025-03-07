import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import UserProvider from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";
import LoaderProvider from "./context/LoaderContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import ThemeProvider
import "./index.css"; // Import styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <LoaderProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" />
          <AuthProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </AuthProvider>
        </BrowserRouter>
      </LoaderProvider>
    </ThemeProvider>
  </React.StrictMode>
);
