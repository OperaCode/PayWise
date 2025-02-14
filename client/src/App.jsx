
import React from 'react';
import './App.css'
import { Route, Routes } from "react-router-dom";

import LandingPage from './Pages/landingPage';
import Login from './Pages/SignIn';
import Register from './Pages/Register';

const App = () => {
  const RenderRoutes = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  )
  return (
    < >
     {RenderRoutes()}
    </>
  )
}

export default App
