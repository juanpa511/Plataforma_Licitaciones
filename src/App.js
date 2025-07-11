import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import LicitacionesDetails from './components/LicitacionesDetails';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/:region" element={<DashboardPage />} />
          <Route path="/licitacion/:id" element={<LicitacionesDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;