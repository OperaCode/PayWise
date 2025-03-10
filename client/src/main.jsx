import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import UserProvider from "./context/UserContext";
import LoaderProvider from "./context/LoaderContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <LoaderProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" />
            <UserProvider>
              <App />
            </UserProvider>
        </BrowserRouter>
      </LoaderProvider>
    </ThemeProvider>
  </React.StrictMode>
);
