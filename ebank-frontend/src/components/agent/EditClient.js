import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numeroIdentite: '',
    dateAnniversaire: '',
    email: '',
    adressePostale: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      const response = await axios.get(`/agent/clients/${id}`);
      setFormData({
        nom: response.data.nom,
        prenom: response.data.prenom,
        numeroIdentite: response.data.numeroIdentite,
        dateAnniversaire: response.data.dateAnniversaire,
        email: response.data.email,
        adressePostale: response.data.adressePostale
      });
    } catch (err) {
      setError('Erreur lors du chargement du client');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await axios.put(`/agent/clients/${id}`, formData);
      navigate('/agent/clients');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Modifier le client</h1>
        <p className="page-description">Mettre à jour les informations du client</p>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        <button 
          type="button" 
          className="btn btn-outline mb-3"
          onClick={() => navigate('/agent/clients')}
        >
          <FiArrowLeft />
          Retour à la liste
        </button>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                className="form-input"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input
                type="text"
                className="form-input"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Numéro d'identité *</label>
              <input
                type="text"
                className="form-input"
                value={formData.numeroIdentite}
                disabled
                style={{ background: 'var(--background)', cursor: 'not-allowed' }}
              />
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Le numéro d'identité ne peut pas être modifié
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Date anniversaire *</label>
              <input
                type="date"
                className="form-input"
                value={formData.dateAnniversaire}
                onChange={(e) => setFormData({ ...formData, dateAnniversaire: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Adresse postale *</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.adressePostale}
              onChange={(e) => setFormData({ ...formData, adressePostale: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <FiSave />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditClient;