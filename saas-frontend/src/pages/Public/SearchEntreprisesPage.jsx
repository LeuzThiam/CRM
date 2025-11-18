import React, { useEffect, useState } from 'react'
import EntrepriseCard from '../../components/entreprises/EntrepriseCard'
import { listEntreprises } from '../../services/entreprisesApi'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'

export default function SearchEntreprisesPage() {
  const [entreprises, setEntreprises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ domaine: '', ville: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const data = await listEntreprises()
      setEntreprises(data)
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
      const data = await listEntreprises(filters)
      setEntreprises(data)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la recherche.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Rechercher une entreprise</h2>

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-4">
          <input
            type="text"
            name="domaine"
            className="form-control"
            placeholder="Domaine (ex: mécanique, coiffure...)"
            value={filters.domaine}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="ville"
            className="form-control"
            placeholder="Ville"
            value={filters.ville}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 d-grid">
          <button className="btn btn-primary" type="submit">
            <i className="bi bi-search me-1" />
            Rechercher
          </button>
        </div>
      </form>

      {loading && <Loader />}
      {error && <Alert type="danger">{error}</Alert>}

      <div className="row">
        {entreprises.map((ent) => (
          <div key={ent.id} className="col-md-6 col-lg-4">
            <EntrepriseCard entreprise={ent} />
          </div>
        ))}
        {!loading && entreprises.length === 0 && !error && (
          <p>Aucune entreprise trouvée.</p>
        )}
      </div>
    </div>
  )
}
