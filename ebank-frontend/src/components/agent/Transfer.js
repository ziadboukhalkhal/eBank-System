import React, { useState } from 'react';
import axios from '../../api/axios';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

function Transfer() {
  const [formData, setFormData] = useState({
    ribSource: '',
    ribDestinataire: '',
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
      await axios.post('/agent/operations/transfer', {
        ...formData,
        montant: parseFloat(formData.montant)
      });
      setSuccess(true);
      setFormData({ ribSource: '', ribDestinataire: '', montant: '', motif: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du virement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Virement entre comptes</h1>
        <p className="page-description">Transférer de l'argent entre deux comptes</p>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        {success && (
          <div className="alert alert-success">
            <FiCheck />
            Virement effectué avec succès !
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">RIB source *</label>
            <input
              type="text"
              className="form-input"
              value={formData.ribSource}
              onChange={(e) => setFormData({ ...formData, ribSource: e.target.value })}
              placeholder="123456789012345678901234"
              maxLength="24"
              required
            />
          </div>

          <div style={{ 
            textAlign: 'center', 
            margin: '1rem 0',
            color: 'var(--primary)',
            fontSize: '1.5rem'
          }}>
            <FiArrowRight />
          </div>

          <div className="form-group">
            <label className="form-label">RIB destinataire *</label>
            <input
              type="text"
              className="form-input"
              value={formData.ribDestinataire}
              onChange={(e) => setFormData({ ...formData, ribDestinataire: e.target.value })}
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
              placeholder="Virement bancaire..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiArrowRight />
            {loading ? 'Traitement...' : 'Effectuer le virement'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Transfer;