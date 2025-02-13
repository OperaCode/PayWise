
import React from 'react';

import './App.css'
import LandingPage from './Pages/landingPage';
import Header from './components/Header';
import Signup from './Pages/Signup';
import { Route, Routes } from "react-router-dom";

const App = () => {
  const RenderRoutes = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Signup/>} />
    </Routes>
  )
  return (
    < >
     {RenderRoutes()}
    </>
  )
}

export default App
