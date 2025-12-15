import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { FiCreditCard } from 'react-icons/fi';

function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/agent/comptes');
      setAccounts(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des comptes');
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Liste des comptes</h1>
        <p className="page-description">Tous les comptes bancaires</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>RIB</th>
                <th>Client</th>
                <th>Solde</th>
                <th>Statut</th>
                <th>Date création</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <code style={{ 
                      padding: '0.25rem 0.5rem', 
                      background: 'var(--background)', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      {account.rib}
                    </code>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {account.clientPrenom} {account.clientNom}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      {account.solde.toLocaleString('fr-FR')} MAD
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(account.statut)}`}>
                      {account.statut}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {new Date(account.dateCreation).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {accounts.length === 0 && !error && (
          <div className="text-center" style={{ padding: '3rem' }}>
            <FiCreditCard size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Aucun compte enregistré</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountList;