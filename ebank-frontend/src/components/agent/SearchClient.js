import React, { useState } from 'react';
import axios from '../../api/axios';
import { FiSearch, FiMail, FiCalendar, FiMapPin, FiUser } from 'react-icons/fi';

function SearchClient() {
  const [numeroIdentite, setNumeroIdentite] = useState('');
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setClient(null);
    setLoading(true);

    try {
      const response = await axios.get(`/agent/clients/by-numero/${numeroIdentite}`);
      setClient(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Client non trouvé');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Rechercher un client</h1>
        <p className="page-description">Rechercher un client par numéro d'identité</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">Numéro d'identité</label>
            <input
              type="text"
              className="form-input"
              value={numeroIdentite}
              onChange={(e) => setNumeroIdentite(e.target.value)}
              placeholder="Entrez le numéro d'identité"
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

      {client && (
        <div className="card" style={{ maxWidth: '700px' }}>
          <div className="flex-between mb-2">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
              {client.prenom} {client.nom}
            </h3>
            <span className="badge badge-info">ID: {client.numeroIdentite}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FiUser size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Login</div>
                <div style={{ fontWeight: 500 }}>{client.login}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FiMail size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</div>
                <div style={{ fontWeight: 500 }}>{client.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FiCalendar size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date de naissance</div>
                <div style={{ fontWeight: 500 }}>
                  {new Date(client.dateAnniversaire).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FiMapPin size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Adresse</div>
                <div style={{ fontWeight: 500 }}>{client.adressePostale}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchClient;