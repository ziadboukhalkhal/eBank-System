import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { FiUsers, FiMail, FiCalendar, FiMapPin } from 'react-icons/fi';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/agent/clients');
      setClients(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Liste des clients</h1>
        <p className="page-description">Tous les clients enregistrés</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="grid grid-2">
        {clients.map((client) => (
          <div key={client.id} className="card">
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                {client.prenom} {client.nom}
              </h3>
              <span className="badge badge-info">ID: {client.numeroIdentite}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <FiMail size={16} />
                <span>{client.email}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <FiCalendar size={16} />
                <span>{new Date(client.dateAnniversaire).toLocaleDateString('fr-FR')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <FiMapPin size={16} />
                <span>{client.adressePostale}</span>
              </div>

              <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Login: <strong style={{ color: 'var(--text-primary)' }}>{client.login}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && !error && (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <FiUsers size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Aucun client enregistré</p>
        </div>
      )}
    </div>
  );
}

export default ClientList;