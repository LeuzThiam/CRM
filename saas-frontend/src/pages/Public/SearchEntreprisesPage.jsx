import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EntrepriseCard from '../../components/entreprises/EntrepriseCard'
import { listEntreprises } from '../../services/entreprisesApi'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import { extractResults } from '../../utils/pagination'

export default function SearchEntreprisesPage() {
  const { isAuthenticated, role } = useAuth()
  const [entreprises, setEntreprises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ search: '', domaine: '', ville: '' })
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const data = await listEntreprises()
      const results = extractResults(data)
      setEntreprises(results)
      setHasSearched(false)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des entreprises.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const data = await listEntreprises(filters)
      const results = extractResults(data)
      setEntreprises(results)
      setHasSearched(true)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la recherche.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({ search: '', domaine: '', ville: '' })
    fetchData()
  }

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <div className="search-header-icon mb-3">
          <i className="bi bi-search" />
        </div>
        <h1 className="display-5 fw-bold mb-3">Rechercher une entreprise</h1>
        <p className="text-muted lead">
          Trouvez l'entreprise qui correspond à vos besoins parmi nos partenaires
        </p>
      </div>

      {/* Search Form */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-12 mb-3">
                <label htmlFor="search" className="form-label fw-semibold">
                  <i className="bi bi-search me-2 text-primary" />
                  Recherche globale
                </label>
                <input
                  id="search"
                  type="text"
                  name="search"
                  className="form-control form-control-lg"
                  placeholder="Rechercher par nom, domaine, description ou ville..."
                  value={filters.search}
                  onChange={handleChange}
                />
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1" />
                  Tapez un mot-clé pour rechercher dans tous les champs
                </small>
              </div>
            </div>
            
            <div className="row g-3">
              <div className="col-md-5">
                <label htmlFor="domaine" className="form-label fw-semibold">
                  <i className="bi bi-tag-fill me-2 text-primary" />
                  Domaine
                </label>
                <input
                  id="domaine"
                  type="text"
                  name="domaine"
                  className="form-control form-control-lg"
                  placeholder="Ex: mécanique, coiffure, consulting..."
                  value={filters.domaine}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-5">
                <label htmlFor="ville" className="form-label fw-semibold">
                  <i className="bi bi-geo-alt-fill me-2 text-primary" />
                  Ville
                </label>
                <input
                  id="ville"
                  type="text"
                  name="ville"
                  className="form-control form-control-lg"
                  placeholder="Ex: Paris, Lyon, Marseille..."
                  value={filters.ville}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <div className="d-grid w-100 gap-2">
                  <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Recherche...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2" />
                        Rechercher
                      </>
                    )}
                  </button>
                  {(filters.search || filters.domaine || filters.ville) && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-sm" 
                      onClick={handleReset}
                    >
                      <i className="bi bi-x-circle me-1" />
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {loading && <Loader />}
      {error && <Alert type="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          {entreprises.length > 0 ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">
                  <i className="bi bi-list-ul me-2 text-primary" />
                  {hasSearched ? `Résultats de recherche (${entreprises.length})` : `Toutes les entreprises (${entreprises.length})`}
                </h3>
              </div>
              <div className="row g-4">
                {entreprises.map((ent) => (
                  <div key={ent.id} className="col-md-6 col-lg-4">
                    <EntrepriseCard entreprise={ent} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="empty-state">
                <i className="bi bi-inbox display-1 text-muted mb-3" />
                <h4 className="mb-3">Aucune entreprise trouvée</h4>
                {hasSearched ? (
                  <>
                    <p className="text-muted mb-4">
                      Aucune entreprise ne correspond à vos critères de recherche.
                      <br />
                      Essayez de modifier vos filtres ou consultez toutes les entreprises disponibles.
                    </p>
                    <button className="btn btn-outline-primary" onClick={handleReset}>
                      <i className="bi bi-arrow-counterclockwise me-2" />
                      Voir toutes les entreprises
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-muted mb-4">
                      Il n'y a actuellement aucune entreprise disponible sur la plateforme.
                    </p>
                    {!isAuthenticated && (
                      <Link to="/register" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2" />
                        Devenir la première entreprise
                      </Link>
                    )}
                    {isAuthenticated && role === 'entreprise' && (
                      <Link to="/entreprise/dashboard" className="btn btn-primary">
                        <i className="bi bi-speedometer2 me-2" />
                        Accéder à mon dashboard
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
