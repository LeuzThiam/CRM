import React, { useEffect, useState } from 'react'
import SidebarEntreprise from '../../components/layout/SidebarEntreprise'
import {
  getEntrepriseServicesMe,
  createEntrepriseService,
  updateEntrepriseService,
  deleteEntrepriseService
} from '../../services/entrepriseApi'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'

export default function EntrepriseServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    nom: '',
    description: '',
    duree_minutes: 60,
    prix: 0
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    try {
      setLoading(true)
      const data = await getEntrepriseServicesMe()
      setServices(data)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des services.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (editingId) {
        await updateEntrepriseService(editingId, form)
      } else {
        await createEntrepriseService(form)
      }
      setForm({ nom: '', description: '', duree_minutes: 60, prix: 0 })
      setEditingId(null)
      await loadServices()
    } catch (err) {
      console.error(err)
      setError("Erreur lors de l'enregistrement du service.")
    }
  }

  const handleEdit = (service) => {
    setEditingId(service.id)
    setForm({
      nom: service.nom,
      description: service.description,
      duree_minutes: service.duree_minutes,
      prix: service.prix
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return
    try {
      await deleteEntrepriseService(id)
      await loadServices()
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarEntreprise />
        </div>
        <div className="col-md-9">
          <h3 className="mb-3">Mes services</h3>
          {error && <Alert type="danger">{error}</Alert>}

          <form className="card mb-4" onSubmit={handleSubmit}>
            <div className="card-body row g-2">
              <div className="col-md-4">
                <input
                  type="text"
                  name="nom"
                  className="form-control"
                  placeholder="Nom du service"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  name="duree_minutes"
                  className="form-control"
                  placeholder="Durée (min)"
                  value={form.duree_minutes}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  step="0.01"
                  name="prix"
                  className="form-control"
                  placeholder="Prix"
                  value={form.prix}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="card-footer text-end">
              <button className="btn btn-primary" type="submit">
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>

          {loading && <Loader />}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Durée (min)</th>
                  <th>Prix</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nom}</td>
                    <td>{s.description}</td>
                    <td>{s.duree_minutes}</td>
                    <td>{s.prix}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" onClick={() => handleEdit(s)}>
                          Modifier
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(s.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && services.length === 0 && (
                  <tr>
                    <td colSpan="5">Aucun service pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
