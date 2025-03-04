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
// import Header from './components/Header.jsx';
import PaymentAnalytics from './Pages/PaymentAnalytics.jsx';
// import SideBar from './components/SideBar.jsx';
import DashLayout from './Layouts/DashLayout.jsx';
import DashBoard from './Dashboards/DashBoard.jsx';
import Payment from "./Dashboards/MakePayment.jsx"

// import { auth, googleProvider } from "./Hooks/FirebaseConfig"; // ✅ Correct import
import ManageBillers from './Dashboards/ManageBillers.jsx';


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


// ✅ Secure Firebase configuration using .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


signInWithPopup(auth, provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  })

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
        <Route path="/payment" element={<DashLayout><Payment/></DashLayout>} />
        <Route path="/billers" element={<DashLayout><ManageBillers/></DashLayout>} />
        <Route path="/analytics" element={<PaymentAnalytics />} />
      </Routes>
    </div>
  );
};

export default App;
