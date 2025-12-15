import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../api/axios';
import { FiCreditCard, FiTrendingUp, FiTrendingDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function TableauBord() {
  const [data, setData] = useState(null);
  const [selectedRib, setSelectedRib] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTableauBord = useCallback(async () => {
    try {
      const params = {
        page: currentPage,
        size: 10
      };
      if (selectedRib) {
        params.rib = selectedRib;
      }

      const response = await axios.get('/client/tableau-bord', { params });
      setData(response.data);

      if (!selectedRib && response.data.compteActif) {
        setSelectedRib(response.data.compteActif.rib);
      }
    } catch (err) {
      setError('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  }, [selectedRib, currentPage]);

  useEffect(() => {
    fetchTableauBord();
  }, [fetchTableauBord]);

  const handleAccountChange = (rib) => {
    setSelectedRib(rib);
    setCurrentPage(0);
  };

  const getOperationIcon = (type) => {
    return type === 'CREDIT' ? (
      <FiTrendingUp style={{ color: 'var(--success)' }} />
    ) : (
      <FiTrendingDown style={{ color: 'var(--danger)' }} />
    );
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!data || !data.compteActif) {
    return (
      <div className="card text-center" style={{ padding: '3rem' }}>
        <FiCreditCard size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Aucun compte bancaire disponible</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-description">Vue d'ensemble de vos comptes</p>
      </div>

      {/* Account Selector */}
      {data.comptes && data.comptes.length > 1 && (
        <div className="card mb-3">
          <label className="form-label">Sélectionner un compte</label>
          <select 
            className="form-select"
            value={selectedRib}
            onChange={(e) => handleAccountChange(e.target.value)}
          >
            {data.comptes.map((compte) => (
              <option key={compte.rib} value={compte.rib}>
                {compte.rib} - {compte.solde.toLocaleString('fr-FR')} MAD
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Account Balance Card */}
      <div className="card mb-3" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <FiCreditCard size={32} />
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Compte bancaire</div>
            <div style={{ fontSize: '1rem', fontFamily: 'monospace', marginTop: '0.25rem' }}>
              {data.compteActif.rib}
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Solde disponible</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.25rem' }}>
            {data.compteActif.solde.toLocaleString('fr-FR')} MAD
          </div>
        </div>

        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.875rem'
        }}>
          <span>Statut: {data.compteActif.statut}</span>
          <span>Dernière opération: {new Date(data.compteActif.dateDerniereOperation).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Operations Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Dernières opérations</h3>
        </div>

        {data.derniersOperations && data.derniersOperations.length > 0 ? (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Opération</th>
                    <th>Type</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.derniersOperations.map((op) => (
                    <tr key={op.id}>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {new Date(op.dateOperation).toLocaleDateString('fr-FR')}
                        <div style={{ fontSize: '0.75rem' }}>
                          {new Date(op.dateOperation).toLocaleTimeString('fr-FR')}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{op.intitule}</div>
                        {op.motif && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {op.motif}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getOperationIcon(op.type)}
                          <span className={`badge ${op.type === 'CREDIT' ? 'badge-success' : 'badge-danger'}`}>
                            {op.type}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: 600,
                          color: op.type === 'CREDIT' ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {op.type === 'CREDIT' ? '+' : '-'}{op.montant.toLocaleString('fr-FR')} MAD
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderTop: '1px solid var(--border)'
              }}>
                <button
                  className="btn btn-outline"
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  <FiChevronLeft />
                </button>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Page {currentPage + 1} sur {data.totalPages}
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => setCurrentPage(p => Math.min(data.totalPages - 1, p + 1))}
                  disabled={currentPage === data.totalPages - 1}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center" style={{ padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Aucune opération enregistrée</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableauBord;