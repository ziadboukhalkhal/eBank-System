import React, { useState } from 'react';
import axios from '../../api/axios';
import { FiMinusCircle, FiCheck } from 'react-icons/fi';

function Withdraw() {
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
      await axios.post('/agent/operations/withdraw', {
        ...formData,
        montant: parseFloat(formData.montant)
      });
      setSuccess(true);
      setFormData({ rib: '', montant: '', motif: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du retrait');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Retrait d'espèces</h1>
        <p className="page-description">Débiter un compte bancaire</p>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        {success && (
          <div className="alert alert-success">
            <FiCheck />
            Retrait effectué avec succès !
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
              placeholder="500.00"
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
              placeholder="Retrait espèces..."
              required
            />
          </div>

          <button type="submit" className="btn btn-danger" disabled={loading}>
            <FiMinusCircle />
            {loading ? 'Traitement...' : 'Effectuer le retrait'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Withdraw;