import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEntreprises } from '../../services/entreprisesApi'
import EntrepriseCard from '../../components/entreprises/EntrepriseCard'
import Loader from '../../components/ui/Loader'
import { extractResults } from '../../utils/pagination'

export default function HomePage() {
  const [entreprises, setEntreprises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEntreprises() {
      try {
        const data = await listEntreprises()
        const results = extractResults(data)
        // Prendre les 3 premières entreprises
        setEntreprises(results.slice(0, 3))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchEntreprises()
  }, [])

  return (
    <>
      {/* Hero Section avec gradient */}
      <div className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="hero-content">
                <div className="hero-badge mb-3">
                  <span className="badge bg-white text-primary px-3 py-2">
                    <i className="bi bi-star-fill me-2" />
                    Plateforme de confiance
                  </span>
                </div>
                <h1 className="display-4 fw-bold mb-4 text-white">
                  Plateforme SaaS de prise de rendez-vous
                </h1>
                <p className="lead text-white-50 mb-4">
                  Mettez en relation des clients et des entreprises de tous secteurs
                  (mécanique, coiffure, consulting, etc.) grâce à une interface simple,
                  moderne et responsive.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link to="/recherche" className="btn btn-light btn-lg px-4 py-3 fw-semibold">
                    <i className="bi bi-search me-2" />
                    Rechercher des entreprises
                  </Link>
                  <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold">
                    <i className="bi bi-building me-2" />
                    Devenir entreprise partenaire
                  </Link>
                </div>
                <div className="hero-features">
                  <div className="row g-3">
                    <div className="col-6 col-md-4">
                      <div className="d-flex align-items-center text-white-50">
                        <i className="bi bi-check-circle-fill text-success me-2" />
                        <small>Gratuit</small>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="d-flex align-items-center text-white-50">
                        <i className="bi bi-check-circle-fill text-success me-2" />
                        <small>Sécurisé</small>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="d-flex align-items-center text-white-50">
                        <i className="bi bi-check-circle-fill text-success me-2" />
                        <small>24/7</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-illustration">
                <div className="hero-icon-wrapper">
                  <i className="bi bi-calendar4-week hero-icon" />
                </div>
                <div className="hero-stats mt-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="stat-card">
                        <h3 className="text-white mb-1">100+</h3>
                        <small className="text-white-50">Entreprises</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-card">
                        <h3 className="text-white mb-1">500+</h3>
                        <small className="text-white-50">Réservations</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Entreprises */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Entreprises à découvrir</h2>
          <p className="text-muted lead">
            Découvrez nos entreprises partenaires et réservez vos services en toute simplicité
          </p>
        </div>
        
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="row g-4 mb-4">
              {entreprises.map((entreprise) => (
                <div key={entreprise.id} className="col-md-6 col-lg-4">
                  <EntrepriseCard entreprise={entreprise} />
                </div>
              ))}
            </div>
            {!loading && entreprises.length === 0 && (
              <div className="text-center py-5">
                <div className="empty-state">
                  <i className="bi bi-inbox display-1 text-muted mb-3" />
                  <p className="text-muted fs-5">Aucune entreprise disponible pour le moment.</p>
                  <Link to="/register" className="btn btn-primary mt-3">
                    <i className="bi bi-plus-circle me-2" />
                    Devenir la première entreprise
                  </Link>
                </div>
              </div>
            )}
            {entreprises.length > 0 && (
              <div className="text-center mt-5">
                <Link to="/recherche" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-arrow-right me-2" />
                  Voir toutes les entreprises
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Section Features */}
      <div className="bg-light py-5 mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-clock-history" />
                </div>
                <h5 className="fw-bold mb-3">Gestion en temps réel</h5>
                <p className="text-muted mb-0">
                  Suivez vos réservations et disponibilités en temps réel avec une interface intuitive.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-shield-check" />
                </div>
                <h5 className="fw-bold mb-3">Sécurisé et fiable</h5>
                <p className="text-muted mb-0">
                  Vos données sont protégées avec les meilleures pratiques de sécurité.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-phone" />
                </div>
                <h5 className="fw-bold mb-3">100% Responsive</h5>
                <p className="text-muted mb-0">
                  Accédez à votre espace depuis n'importe quel appareil, partout et à tout moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
