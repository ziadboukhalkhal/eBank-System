import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogIn, FiLock, FiUser } from 'react-icons/fi';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
    } catch (err) {
      setError(err.response?.data?.message || 'Login ou mot de passe erronés');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape"></div>
        <div className="login-shape"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <FiLock size={32} />
          </div>
          <h1>eBank</h1>
          <p>Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Login</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" />
              <input
                type="text"
                className="form-input"
                value={credentials.login}
                onChange={(e) => setCredentials({ ...credentials, login: e.target.value })}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                className="form-input"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Connexion...' : (
              <>
                <FiLogIn />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Compte par défaut: agent / agent123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;