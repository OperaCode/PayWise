import React, { useState, useEffect } from 'react';
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

const App = () => {
  const [loading, setLoading] =useState(true);

  useEffect(() => {
    // Simulate an API call or app initialization delay
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
    <>
      {loading ? (
        <Loader /> // Show loader while loading
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<LandingLayout><AboutUs /></LandingLayout>} />
          <Route path="/terms-and-conditions" element={<LandingLayout><TermsAndConditions /></LandingLayout>} />
          <Route path="/privacy-policy" element={<LandingLayout><Privacy /></LandingLayout>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </>
  );
};

export default App;
