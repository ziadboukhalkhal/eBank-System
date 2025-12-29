import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import CreateClient from '../components/agent/CreateClient';
import CreateAccount from '../components/agent/CreateAccount';
import ClientList from '../components/agent/ClientList';
import AccountList from '../components/agent/AccountList';
import SearchClient from '../components/agent/SearchClient';
import SearchAccount from '../components/agent/SearchAccount';
import EditClient from '../components/agent/EditClient';
import ManageAccount from '../components/agent/ManageAccount';
import Deposit from '../components/agent/Deposit';
import Withdraw from '../components/agent/Withdraw';
import Transfer from '../components/agent/Transfer';
import { FiUsers, FiCreditCard, FiList, FiSearch, FiPlusCircle, FiMinusCircle, FiArrowRight } from 'react-icons/fi';
import './AgentDashboard.css';

function AgentDashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0.5rem 1rem', textTransform: 'uppercase' }}>
              Clients
            </div>
            <NavLink to="/agent/clients" className="sidebar-link">
              <FiUsers />
              <span>Liste clients</span>
            </NavLink>
            <NavLink to="/agent/create-client" className="sidebar-link">
              <FiUsers />
              <span>Nouveau client</span>
            </NavLink>
            <NavLink to="/agent/search-client" className="sidebar-link">
              <FiSearch />
              <span>Rechercher client</span>
            </NavLink>

            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0.5rem 1rem', textTransform: 'uppercase', marginTop: '1rem' }}>
              Comptes
            </div>
            <NavLink to="/agent/accounts" className="sidebar-link">
              <FiList />
              <span>Liste comptes</span>
            </NavLink>
            <NavLink to="/agent/create-account" className="sidebar-link">
              <FiCreditCard />
              <span>Nouveau compte</span>
            </NavLink>
            <NavLink to="/agent/search-account" className="sidebar-link">
              <FiSearch />
              <span>Rechercher compte</span>
            </NavLink>

            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0.5rem 1rem', textTransform: 'uppercase', marginTop: '1rem' }}>
              Opérations
            </div>
            <NavLink to="/agent/deposit" className="sidebar-link">
              <FiPlusCircle />
              <span>Dépôt</span>
            </NavLink>
            <NavLink to="/agent/withdraw" className="sidebar-link">
              <FiMinusCircle />
              <span>Retrait</span>
            </NavLink>
            <NavLink to="/agent/transfer" className="sidebar-link">
              <FiArrowRight />
              <span>Virement</span>
            </NavLink>
          </nav>
        </aside>

        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<ClientList />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/create-client" element={<CreateClient />} />
            <Route path="/edit-client/:id" element={<EditClient />} />
            <Route path="/search-client" element={<SearchClient />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/manage-account/:rib" element={<ManageAccount />} />
            <Route path="/search-account" element={<SearchAccount />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/transfer" element={<Transfer />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AgentDashboard;