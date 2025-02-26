

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import ThemeProvider
import "./index.css"; // Import styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);












// import React from 'react';
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.jsx';
// import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "./context/ThemeContext";

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <ThemeProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </ThemeProvider>
//   </StrictMode>
// );
