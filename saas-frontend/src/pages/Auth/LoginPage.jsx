import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import Loader from '../../components/ui/Loader'

export default function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const credentials = {
        password: form.password
      }
      
      // Détecter si c'est un email ou un username
      if (form.identifier.includes('@')) {
        credentials.email = form.identifier
      } else {
        credentials.username = form.identifier
      }

      const data = await login(credentials)
      
      // Redirection selon le rôle
      if (data.user.role === 'client') {
        navigate('/client/dashboard')
      } else if (data.user.role === 'entreprise') {
        navigate('/entreprise/dashboard')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.detail || err.response?.data?.message || "Identifiants invalides ou erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

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
                    <i className="bi bi-box-arrow-in-right"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Connexion</h2>
                  <p className="text-muted mb-0">
                    Accédez à votre espace personnel
                  </p>
                </div>

                {error && (
                  <div className="mb-4">
                    <Alert type="danger">{error}</Alert>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email ou Username */}
                  <div className="mb-3">
                    <label htmlFor="identifier" className="form-label fw-semibold">
                      <i className="bi bi-person-fill me-2 text-primary"></i>
                      Email ou Nom d'utilisateur
                    </label>
                    <input
                      id="identifier"
                      name="identifier"
                      type="text"
                      className="form-control form-control-lg"
                      value={form.identifier}
                      onChange={handleChange}
                      placeholder="votre@email.com ou nom d'utilisateur"
                      required
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-4">
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
                      placeholder="Votre mot de passe"
                      required
                    />
                    <div className="d-flex justify-content-end mt-2">
                      <Link to="/" className="text-decoration-none small text-muted">
                        <i className="bi bi-question-circle me-1"></i>
                        Mot de passe oublié ?
                      </Link>
                    </div>
                  </div>

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
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Se connecter
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="divider my-4">
                  <span className="divider-text">ou</span>
                </div>

                {/* Lien inscription */}
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Pas encore de compte ?{" "}
                    <Link to="/register" className="fw-semibold text-decoration-none">
                      Créer un compte
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                <i className="bi bi-shield-check me-1"></i>
                Connexion sécurisée
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
