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
import PaymentAnalytics from './Pages/PaymentAnalytics.jsx';
import DashLayout from './Layouts/DashLayout.jsx';
import DashBoard from './Dashboards/DashBoard.jsx';
import Payment from "./Dashboards/MakePayment.jsx";
import ManageBillers from './Dashboards/ManageBillers.jsx';
import Analytics from "./Dashboards/RewardsAndAnalytics.jsx"
import Messages from "./Dashboards/Messages.jsx"



const App = () => {
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext); // Get theme from context

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
        <Route path="/payment" element={<DashLayout><Payment/></DashLayout>} />
        <Route path="/billers" element={<DashLayout><ManageBillers currency={formatCurrency}/></DashLayout>} />
        <Route path="/analytics" element={<DashLayout><Analytics/></DashLayout>} />
        <Route path="/messages" element={<DashLayout><Messages/></DashLayout>} />
      </Routes>
    </div>
  );
};

export default App;
