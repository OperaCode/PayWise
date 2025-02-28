import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import UserProvider from "./context/UserContext";
import LoaderProvider from "./context/LoaderContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import ThemeProvider
import "./index.css"; // Import styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <LoaderProvider>
          <BrowserRouter>
            <ToastContainer position="top-right" />
            <App />
          </BrowserRouter>
        </LoaderProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);

