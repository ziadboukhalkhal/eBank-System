import React, { useState } from 'react';
import axios from '../../api/axios';
import { FiCreditCard, FiCheck } from 'react-icons/fi';

function CreateAccount() {
  const [formData, setFormData] = useState({
    rib: '',
    numeroIdentite: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
            <input
              type="text"
              className="form-input"
              value={formData.rib}
              onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
              placeholder="123456789012345678901234"
              maxLength="24"
              required
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Le RIB doit contenir exactement 24 chiffres
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Numéro d'identité du client *</label>
            <input
              type="text"
              className="form-input"
              value={formData.numeroIdentite}
              onChange={(e) => setFormData({ ...formData, numeroIdentite: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiCreditCard />
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;