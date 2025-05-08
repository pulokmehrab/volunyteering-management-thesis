import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './pages/Navbar';  // Assuming Navbar is in components folder
import LandingPage from './pages/LandingPage';
import Donation from './pages/Donation'; // Adjust path if different
import FaqPage from './pages/Faq';
import EventsPage from './pages/Event';

function App() {
  return (
    <Router>
      <Navbar />  {/* Add Navbar here so it appears on all pages */}
      <Routes>
      <Route path="/" element={<LandingPage />} />
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/faq" element={<FaqPage />} />
<Route path="/events" element={<EventsPage />} />

      </Routes>
    </Router>
  );
}

export default App;