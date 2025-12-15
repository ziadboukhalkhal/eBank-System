import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import CreateClient from '../components/agent/CreateClient';
import CreateAccount from '../components/agent/CreateAccount';
import ClientList from '../components/agent/ClientList';
import AccountList from '../components/agent/AccountList';
import { FiUsers, FiCreditCard, FiList } from 'react-icons/fi';
import './AgentDashboard.css';

function AgentDashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/agent/clients" className="sidebar-link">
              <FiUsers />
              <span>Clients</span>
            </NavLink>
            <NavLink to="/agent/create-client" className="sidebar-link">
              <FiUsers />
              <span>Nouveau client</span>
            </NavLink>
            <NavLink to="/agent/accounts" className="sidebar-link">
              <FiList />
              <span>Comptes</span>
            </NavLink>
            <NavLink to="/agent/create-account" className="sidebar-link">
              <FiCreditCard />
              <span>Nouveau compte</span>
            </NavLink>
          </nav>
        </aside>

        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<ClientList />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/create-client" element={<CreateClient />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/create-account" element={<CreateAccount />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AgentDashboard;