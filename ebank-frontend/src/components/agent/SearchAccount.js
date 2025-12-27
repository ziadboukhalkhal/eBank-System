import React, { useState } from 'react';
import axios from '../../api/axios';
import { FiSearch, FiCreditCard, FiUser } from 'react-icons/fi';

function SearchAccount() {
  const [rib, setRib] = useState('');
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setAccount(null);
    setLoading(true);

    try {
      const response = await axios.get(`/agent/comptes/by-rib/${rib}`);
      setAccount(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Compte non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'OUVERT':
        return 'badge-success';
      case 'BLOQUE':
        return 'badge-warning';
      case 'CLOTURE':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Rechercher un compte</h1>
        <p className="page-description">Rechercher un compte par RIB</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">RIB (24 chiffres)</label>
            <input
              type="text"
              className="form-input"
              value={rib}
              onChange={(e) => setRib(e.target.value)}
              placeholder="123456789012345678901234"
              maxLength="24"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiSearch />
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {account && (
        <div className="card" style={{ maxWidth: '700px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <FiCreditCard size={32} />
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>RIB</div>
                <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                  {account.rib}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Solde disponible</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.25rem' }}>
                {account.solde.toLocaleString('fr-FR')} MAD
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FiUser size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Titulaire</div>
                <div style={{ fontWeight: 500 }}>
                  {account.clientPrenom} {account.clientNom}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Statut</div>
                <span className={`badge ${getStatusBadge(account.statut)}`} style={{ marginTop: '0.5rem' }}>
                  {account.statut}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date de création</div>
                <div style={{ marginTop: '0.5rem', fontWeight: 500 }}>
                  {new Date(account.dateCreation).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dernière opération</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 500 }}>
                {new Date(account.dateDerniereOperation).toLocaleDateString('fr-FR')} à{' '}
                {new Date(account.dateDerniereOperation).toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchAccount;