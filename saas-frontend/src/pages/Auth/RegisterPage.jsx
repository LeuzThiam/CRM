import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Loader from "../../components/ui/Loader";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
    // Champs entreprise
    nom_entreprise: "",
    description_entreprise: "",
    domaine_entreprise: "",
    adresse_entreprise: "",
    ville_entreprise: "",
    telephone_entreprise: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(form);

      if (form.role === "entreprise") {
        navigate("/entreprise/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || err.response?.data?.message || "Erreur lors de l'inscription. Veuillez vérifier vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-75">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg auth-card">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="auth-icon mb-3">
                    <i className="bi bi-person-plus-fill"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Créer un compte</h2>
                  <p className="text-muted mb-0">
                    Rejoignez notre plateforme et gérez vos rendez-vous facilement
                  </p>
                </div>

                {error && (
                  <div className="mb-4">
                    <Alert type="danger">{error}</Alert>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Nom d'utilisateur */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      <i className="bi bi-person-fill me-2 text-primary"></i>
                      Nom d'utilisateur
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="form-control form-control-lg"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Entrez votre nom d'utilisateur"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="bi bi-envelope-fill me-2 text-primary"></i>
                      Adresse email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control form-control-lg"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-lock-fill me-2 text-primary"></i>
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control form-control-lg"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 caractères"
                      required
                      minLength={8}
                    />
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Le mot de passe doit contenir au moins 8 caractères
                    </small>
                  </div>

                  {/* Rôle */}
                  <div className="mb-4">
                    <label htmlFor="role" className="form-label fw-semibold">
                      <i className="bi bi-person-badge-fill me-2 text-primary"></i>
                      Je suis
                    </label>
                    <select
                      id="role"
                      name="role"
                      className="form-select form-select-lg"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="client">👤 Client - Je souhaite réserver des services</option>
                      <option value="entreprise">🏢 Entreprise - Je propose des services</option>
                    </select>
                  </div>

                  {/* Champs supplémentaires pour les entreprises */}
                  {form.role === "entreprise" && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="nom_entreprise" className="form-label fw-semibold">
                          <i className="bi bi-building me-2 text-primary"></i>
                          Nom de l'entreprise <span className="text-danger">*</span>
                        </label>
                        <input
                          id="nom_entreprise"
                          name="nom_entreprise"
                          type="text"
                          className="form-control form-control-lg"
                          value={form.nom_entreprise}
                          onChange={handleChange}
                          placeholder="Ex: Mon Entreprise"
                          required={form.role === "entreprise"}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="description_entreprise" className="form-label fw-semibold">
                          <i className="bi bi-file-text me-2 text-primary"></i>
                          Description
                        </label>
                        <textarea
                          id="description_entreprise"
                          name="description_entreprise"
                          className="form-control form-control-lg"
                          value={form.description_entreprise}
                          onChange={handleChange}
                          placeholder="Décrivez votre entreprise et vos services..."
                          rows="3"
                        />
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-md-6">
                          <label htmlFor="domaine_entreprise" className="form-label fw-semibold">
                            <i className="bi bi-tag me-2 text-primary"></i>
                            Domaine <span className="text-danger">*</span>
                          </label>
                          <input
                            id="domaine_entreprise"
                            name="domaine_entreprise"
                            type="text"
                            className="form-control form-control-lg"
                            value={form.domaine_entreprise}
                            onChange={handleChange}
                            placeholder="Ex: Mécanique, Coiffure..."
                            required={form.role === "entreprise"}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="ville_entreprise" className="form-label fw-semibold">
                            <i className="bi bi-geo-alt me-2 text-primary"></i>
                            Ville <span className="text-danger">*</span>
                          </label>
                          <input
                            id="ville_entreprise"
                            name="ville_entreprise"
                            type="text"
                            className="form-control form-control-lg"
                            value={form.ville_entreprise}
                            onChange={handleChange}
                            placeholder="Ex: Paris, Lyon..."
                            required={form.role === "entreprise"}
                          />
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-md-8">
                          <label htmlFor="adresse_entreprise" className="form-label fw-semibold">
                            <i className="bi bi-pin-map me-2 text-primary"></i>
                            Adresse
                          </label>
                          <input
                            id="adresse_entreprise"
                            name="adresse_entreprise"
                            type="text"
                            className="form-control form-control-lg"
                            value={form.adresse_entreprise}
                            onChange={handleChange}
                            placeholder="Ex: 123 Rue de la République"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="telephone_entreprise" className="form-label fw-semibold">
                            <i className="bi bi-telephone me-2 text-primary"></i>
                            Téléphone
                          </label>
                          <input
                            id="telephone_entreprise"
                            name="telephone_entreprise"
                            type="tel"
                            className="form-control form-control-lg"
                            value={form.telephone_entreprise}
                            onChange={handleChange}
                            placeholder="Ex: 01 23 45 67 89"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Bouton submit */}
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill me-2"></i>
                          Créer mon compte
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="divider my-4">
                  <span className="divider-text">ou</span>
                </div>

                {/* Lien connexion */}
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Déjà un compte ?{" "}
                    <Link to="/login" className="fw-semibold text-decoration-none">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                <i className="bi bi-shield-check me-1"></i>
                Vos données sont sécurisées et protégées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
