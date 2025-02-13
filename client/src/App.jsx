
import React from 'react';

import './App.css'
import LandingPage from './Pages/landingPage';
import Header from './components/Header';
import Signup from './Pages/Signup';
import { Route, Routes } from "react-router-dom";
import Login from './Pages/Login';

const App = () => {
  const RenderRoutes = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Signup/>} />
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
