import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { FiArrowLeft, FiAlertCircle, FiCheck } from 'react-icons/fi';

function ManageAccount() {
  const { rib } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAccount();
  }, [rib]);

  const fetchAccount = async () => {
    try {
      const response = await axios.get(`/agent/comptes/by-rib/${rib}`);
      setAccount(response.data);
      setNewStatus(response.data.statut);
    } catch (err) {
      setError('Erreur lors du chargement du compte');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setUpdating(true);

    try {
      await axios.patch(`/agent/comptes/${rib}/status`, { statut: newStatus });
      setSuccess(true);
      setTimeout(() => {
        navigate('/agent/accounts');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
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

  const getStatusDescription = (statut) => {
    switch (statut) {
      case 'OUVERT':
        return 'Le compte est actif et toutes les opérations sont autorisées.';
      case 'BLOQUE':
        return 'Le compte est bloqué. Aucune opération ne peut être effectuée.';
      case 'CLOTURE':
        return 'Le compte est clôturé définitivement.';
      default:
        return '';
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!account) {
    return (
      <div className="alert alert-error">
        Compte non trouvé
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gérer le compte</h1>
        <p className="page-description">Modifier le statut du compte bancaire</p>
      </div>

      <button 
        type="button" 
        className="btn btn-outline mb-3"
        onClick={() => navigate('/agent/accounts')}
      >
        <FiArrowLeft />
        Retour à la liste
      </button>

      {success && (
        <div className="alert alert-success">
          <FiCheck />
          Statut mis à jour avec succès ! Redirection...
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Account Info Card */}
      <div className="card mb-3" style={{ maxWidth: '700px' }}>
        <h3 className="card-title mb-3">Informations du compte</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>RIB</div>
            <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '1.125rem' }}>
              {account.rib}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Titulaire</div>
            <div style={{ fontWeight: 600 }}>
              {account.clientPrenom} {account.clientNom}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Solde</div>
            <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary)' }}>
              {account.solde.toLocaleString('fr-FR')} MAD
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Statut actuel</div>
            <span className={`badge ${getStatusBadge(account.statut)}`} style={{ marginTop: '0.5rem' }}>
              {account.statut}
            </span>
          </div>
        </div>
      </div>

      {/* Change Status Form */}
      <div className="card" style={{ maxWidth: '700px' }}>
        <h3 className="card-title mb-3">Modifier le statut</h3>

        <form onSubmit={handleStatusChange}>
          <div className="form-group">
            <label className="form-label">Nouveau statut</label>
            <select
              className="form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              <option value="OUVERT">OUVERT - Compte actif</option>
              <option value="BLOQUE">BLOQUE - Compte bloqué</option>
              <option value="CLOTURE">CLOTURE - Compte clôturé</option>
            </select>
          </div>

          {newStatus && (
            <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
              <FiAlertCircle />
              <div>
                <strong>Attention :</strong> {getStatusDescription(newStatus)}
              </div>
            </div>
          )}

          {newStatus === 'CLOTURE' && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              <FiAlertCircle />
              <div>
                <strong>Action irréversible :</strong> Une fois clôturé, le compte ne pourra plus être réactivé.
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={updating || newStatus === account.statut}
          >
            {updating ? 'Mise à jour...' : 'Mettre à jour le statut'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageAccount;