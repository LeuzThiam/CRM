import React, { useEffect, useState } from 'react'
import SidebarEntreprise from '../../components/layout/SidebarEntreprise'
import {
  getMesDisponibilites,
  createDisponibilite,
  deleteDisponibilite
} from '../../services/entrepriseApi'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import { formatDate, formatTime } from '../../utils/dateUtils'
import { extractResults } from '../../utils/pagination'

export default function EntrepriseDisponibilitesPage() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    date: '',
    heure_debut: '',
    heure_fin: '',
    capacite: 1
  })

  useEffect(() => {
    loadSlots()
  }, [])

  async function loadSlots() {
    try {
      setLoading(true)
      const data = await getMesDisponibilites()
      const results = extractResults(data)
      setSlots(results)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des disponibilités.')
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
      await createDisponibilite(form)
      setForm({ date: '', heure_debut: '', heure_fin: '', capacite: 1 })
      await loadSlots()
    } catch (err) {
      console.error(err)
      setError("Erreur lors de l'enregistrement de la disponibilité.")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce créneau ?')) return
    try {
      await deleteDisponibilite(id)
      await loadSlots()
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SidebarEntreprise />
        </div>
        <div className="col-md-9 col-lg-10">
          <h3 className="mb-3">Mes disponibilités</h3>
          {error && <Alert type="danger">{error}</Alert>}

          <form className="card mb-4" onSubmit={handleSubmit}>
            <div className="card-body row g-2">
              <div className="col-md-3">
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="time"
                  name="heure_debut"
                  className="form-control"
                  value={form.heure_debut}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="time"
                  name="heure_fin"
                  className="form-control"
                  value={form.heure_fin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  name="capacite"
                  className="form-control"
                  min="1"
                  value={form.capacite}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="card-footer text-end">
              <button className="btn btn-primary" type="submit">
                Ajouter le créneau
              </button>
            </div>
          </form>

          {loading && <Loader />}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Capacité</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id}>
                    <td>{formatDate(slot.date)}</td>
                    <td>{formatTime(slot.heure_debut)}</td>
                    <td>{formatTime(slot.heure_fin)}</td>
                    <td>{slot.capacite}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(slot.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && slots.length === 0 && (
                  <tr>
                    <td colSpan="5">Aucune disponibilité pour le moment.</td>
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
