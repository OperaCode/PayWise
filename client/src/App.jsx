
import React from 'react';
import './App.css'
import { Route, Routes } from "react-router-dom";
import LandingLayout from './Layouts/LandingLayout';

import LandingPage from './Pages/landingPage';
import Login from './Pages/SignIn';
import Register from './Pages/Register';
import Aboutus from "./Pages/AboutUs"

const App = () => {
  const RenderRoutes = () => (
    <Routes>
      <Route path="/layout" element={<LandingLayout />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<LandingLayout><Aboutus/></LandingLayout>} />
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
