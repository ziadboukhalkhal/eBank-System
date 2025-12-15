import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import TableauBord from '../components/client/TableauBord';
import NouveauVirement from '../components/client/NouveauVirement';
import { FiHome, FiSend } from 'react-icons/fi';
import './AgentDashboard.css';

function ClientDashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/client/tableau-bord" className="sidebar-link">
              <FiHome />
              <span>Tableau de bord</span>
            </NavLink>
            <NavLink to="/client/virement" className="sidebar-link">
              <FiSend />
              <span>Nouveau virement</span>
            </NavLink>
          </nav>
        </aside>

        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<TableauBord />} />
            <Route path="/tableau-bord" element={<TableauBord />} />
            <Route path="/virement" element={<NouveauVirement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default ClientDashboard;