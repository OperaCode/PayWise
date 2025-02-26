import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingLayout from './Layouts/LandingLayout';
import TermsAndConditions from './Pages/TermsAndConditions.jsx';
import LandingPage from './Pages/landingPage';
import Login from './Pages/SignIn';
import Register from './Pages/Register';
import AboutUs from './Pages/AboutUs.jsx';
import Privacy from './Pages/Privacy.jsx';
import Loader from './components/Loader.jsx';
import { ThemeContext } from './context/ThemeContext.jsx';
import Header from './components/Header.jsx';
import PaymentAnalytics from './Pages/PaymentAnalytics.jsx';
import SideBar from './components/SideBar.jsx';
import DashLayout from './Layouts/DashLayout.jsx';
import DashBoard from './Pages/DashBoard.jsx';

import { auth, googleProvider } from "./Hooks/FirebaseConfig"; // ✅ Correct import

const App = () => {
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext); // Get theme from context

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
    <div className={`app-container ${theme}`}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<LandingLayout><AboutUs /></LandingLayout>} />
        <Route path="/terms-and-conditions" element={<LandingLayout><TermsAndConditions /></LandingLayout>} />
        <Route path="/privacy-policy" element={<LandingLayout><Privacy /></LandingLayout>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashLayout><DashBoard/></DashLayout>} />
        <Route path="/analytics" element={<PaymentAnalytics />} />
      </Routes>
    </div>
  );
};

export default App;
