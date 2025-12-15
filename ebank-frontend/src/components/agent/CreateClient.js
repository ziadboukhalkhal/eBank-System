import React, { useState } from 'react';
import axios from '../../api/axios';
import { FiUserPlus, FiCheck } from 'react-icons/fi';

function CreateClient() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numeroIdentite: '',
    dateAnniversaire: '',
    email: '',
    adressePostale: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdClient, setCreatedClient] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post('/agent/clients', formData);
      setCreatedClient(response.data);
      setSuccess(true);
      setFormData({
        nom: '',
        prenom: '',
        numeroIdentite: '',
        dateAnniversaire: '',
        email: '',
        adressePostale: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Nouveau client</h1>
        <p className="page-description">Créer un nouveau compte client</p>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        {success && (
          <div className="alert alert-success">
            <FiCheck />
            Client créé avec succès ! Login: {createdClient?.login}
          </div>
        )}

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
                onChange={(e) => setFormData({ ...formData, numeroIdentite: e.target.value })}
                required
              />
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiUserPlus />
            {loading ? 'Création...' : 'Créer le client'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateClient;