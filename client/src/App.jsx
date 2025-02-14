
import React from 'react';
import './App.css'
import { Route, Routes } from "react-router-dom";
import LandingLayout from './Layouts/LandingLayout';

import LandingPage from './Pages/landingPage';
import Login from './Pages/SignIn';
import Register from './Pages/Register';
import AboutUs from './Pages/AboutUs.jsx';

const App = () => {
  const RenderRoutes = () => (
    <Routes>
      {/* <Route path="/layout" element={<LandingLayout />} /> */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" 
      element={<LandingLayout>
        <AboutUs />
      </LandingLayout>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
  return (
    < >
      {RenderRoutes()}
    </>
  )
}

export default App
