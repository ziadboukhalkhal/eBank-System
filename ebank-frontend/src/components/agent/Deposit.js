import React, { useState } from 'react';
import axios from '../../api/axios';
import { FiPlusCircle, FiCheck } from 'react-icons/fi';

function Deposit() {
  const [formData, setFormData] = useState({
    rib: '',
    montant: '',
    motif: ''
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
      await axios.post('/agent/operations/deposit', {
        ...formData,
        montant: parseFloat(formData.montant)
      });
      setSuccess(true);
      setFormData({ rib: '', montant: '', motif: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du dépôt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dépôt d'espèces</h1>
        <p className="page-description">Créditer un compte bancaire</p>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        {success && (
          <div className="alert alert-success">
            <FiCheck />
            Dépôt effectué avec succès !
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">RIB du compte *</label>
            <input
              type="text"
              className="form-input"
              value={formData.rib}
              onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
              placeholder="123456789012345678901234"
              maxLength="24"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Montant (MAD) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
              placeholder="1000.00"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Motif *</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              placeholder="Dépôt espèces..."
              required
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            <FiPlusCircle />
            {loading ? 'Traitement...' : 'Effectuer le dépôt'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Deposit;