import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Plan from './pages/Plan';
import Progress from './pages/Progress';
import Admin from './pages/Admin';
import DailyWorkout from './pages/DailyWorkout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Profile />} />
          <Route path="plan" element={<Plan />} />
          <Route path="progress" element={<Progress />} />
          <Route path="admin" element={<Admin />} />
          <Route path="workout/:id" element={<DailyWorkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;