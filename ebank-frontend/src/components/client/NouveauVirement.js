import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { FiSend, FiCheck } from 'react-icons/fi';

function NouveauVirement() {
  const [comptes, setComptes] = useState([]);
  const [formData, setFormData] = useState({
    ribSource: '',
    ribDestinataire: '',
    montant: '',
    motif: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComptes();
  }, []);

  const fetchComptes = async () => {
    try {
      const response = await axios.get('/client/tableau-bord');
      setComptes(response.data.comptes || []);
      if (response.data.comptes && response.data.comptes.length > 0) {
        setFormData(prev => ({
          ...prev,
          ribSource: response.data.comptes[0].rib
        }));
      }
    } catch (err) {
      console.error('Erreur lors du chargement des comptes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post('/client/virement', {
        ...formData,
        montant: parseFloat(formData.montant)
      });
      setSuccess(true);
      setFormData({
        ...formData,
        ribDestinataire: '',
        montant: '',
        motif: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du virement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Nouveau virement</h1>
        <p className="page-description">Effectuer un virement bancaire</p>
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
            <label className="form-label">Compte source *</label>
            {comptes.length > 1 ? (
              <select
                className="form-select"
                value={formData.ribSource}
                onChange={(e) => setFormData({ ...formData, ribSource: e.target.value })}
                required
              >
                {comptes.map((compte) => (
                  <option key={compte.rib} value={compte.rib}>
                    {compte.rib} - {compte.solde.toLocaleString('fr-FR')} MAD
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                value={formData.ribSource}
                disabled
                style={{ background: 'var(--background)' }}
              />
            )}
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
              placeholder="Raison du virement..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiSend />
            {loading ? 'Envoi en cours...' : 'Effectuer le virement'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NouveauVirement;