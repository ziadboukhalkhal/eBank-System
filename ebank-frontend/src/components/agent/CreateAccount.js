import React, { useState } from 'react';
import axios from '../../api/axios';
import { FiCreditCard, FiCheck, FiRefreshCw } from 'react-icons/fi';

function CreateAccount() {
  const [formData, setFormData] = useState({
    rib: '',
    numeroIdentite: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateRib = async () => {
    setGenerating(true);
    setError('');
    
    try {
      const response = await axios.get('/agent/generate-rib');
      setFormData({ ...formData, rib: response.data.rib });
    } catch (err) {
      setError('Erreur lors de la génération du RIB');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post('/agent/comptes', formData);
      setSuccess(true);
      setFormData({ rib: '', numeroIdentite: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const formatRibDisplay = (rib) => {
    if (!rib || rib.length !== 24) return rib;
    return `${rib.substring(0, 3)} ${rib.substring(3, 6)} ${rib.substring(6, 22)} ${rib.substring(22)}`;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Nouveau compte bancaire</h1>
        <p className="page-description">Créer un nouveau compte pour un client</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {success && (
          <div className="alert alert-success">
            <FiCheck />
            Compte bancaire créé avec succès !
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">RIB (24 chiffres) *</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={formData.rib}
                onChange={(e) => setFormData({ ...formData, rib: e.target.value.replace(/\s/g, '') })}
                placeholder="123456789012345678901234"
                maxLength="24"
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={generateRib}
                disabled={generating}
                style={{ whiteSpace: 'nowrap' }}
              >
                <FiRefreshCw className={generating ? 'spinning' : ''} />
                {generating ? 'Génération...' : 'Générer RIB'}
              </button>
            </div>
            
            {formData.rib && formData.rib.length === 24 && (
              <div style={{ 
                padding: '0.75rem', 
                background: 'var(--background)', 
                borderRadius: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  RIB formaté:
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600 }}>
                  {formatRibDisplay(formData.rib)}
                </div>
              </div>
            )}
            
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Le RIB doit contenir exactement 24 chiffres. Vous pouvez le générer automatiquement ou le saisir manuellement.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Numéro d'identité du client *</label>
            <input
              type="text"
              className="form-input"
              value={formData.numeroIdentite}
              onChange={(e) => setFormData({ ...formData, numeroIdentite: e.target.value })}
              placeholder="Numéro d'identité du client"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiCreditCard />
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default CreateAccount;