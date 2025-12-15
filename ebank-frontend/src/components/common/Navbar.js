import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiLock, FiMenu, FiX } from 'react-icons/fi';
import ChangePasswordModal from './ChangePasswordModal';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h2>eBank</h2>
            <span className="navbar-role">
              {user?.role === 'AGENT_GUICHET' ? 'Agent' : 'Client'}
            </span>
          </div>

          <button 
            className="navbar-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <div className="navbar-user">
              <span>Bienvenue, {user?.login}</span>
            </div>

            <div className="navbar-actions">
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setShowPasswordModal(true);
                  setMobileMenuOpen(false);
                }}
              >
                <FiLock />
                Changer mot de passe
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                <FiLogOut />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}

export default Navbar;