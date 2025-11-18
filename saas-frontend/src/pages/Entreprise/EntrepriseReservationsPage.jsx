import React, { useEffect, useState } from 'react'
import SidebarEntreprise from '../../components/layout/SidebarEntreprise'
import { getMesReservations, updateReservation } from '../../services/entrepriseApi'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import { formatDate, formatTime } from '../../utils/dateUtils'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import { extractResults } from '../../utils/pagination'

export default function EntrepriseReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingComment, setEditingComment] = useState({})

  useEffect(() => {
    loadReservations()
  }, [])

  async function loadReservations() {
    try {
      setLoading(true)
      const data = await getMesReservations()
      const results = extractResults(data)
      setReservations(results)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des réservations.')
    } finally {
      setLoading(false)
    }
  }

  async function handleChangeStatus(id, statut) {
    try {
      await updateReservation(id, { statut })
      await loadReservations()
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la mise à jour du statut.')
    }
  }

  async function handleUpdateComment(id) {
    try {
      await updateReservation(id, { commentaire_entreprise: editingComment[id] || '' })
      setEditingComment({ ...editingComment, [id]: '' })
      await loadReservations()
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la mise à jour du commentaire.')
    }
  }

  const getStatusBadgeClass = (statut) => {
    const classes = {
      en_attente: 'warning',
      confirme: 'success',
      annule: 'danger',
      termine: 'info'
    }
    return classes[statut] || 'secondary'
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SidebarEntreprise />
        </div>
        <div className="col-md-9 col-lg-10">
          <h3 className="mb-3">Réservations reçues</h3>
          {error && <Alert type="danger">{error}</Alert>}
          {loading && <Loader />}

          {!loading && (
            <div className="row">
              {reservations.length === 0 ? (
                <div className="col-12">
                  <p className="text-muted">Aucune réservation pour le moment.</p>
                </div>
              ) : (
                reservations.map((r) => (
                  <div key={r.id} className="col-12 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <h5 className="card-title">
                              {r.client?.username || 'Client'} - {r.service?.nom || 'Service'}
                            </h5>
                            <p className="card-text">
                              <i className="bi bi-calendar me-1" />
                              {formatDate(r.date)} à {formatTime(r.heure_debut)} - {formatTime(r.heure_fin)}
                            </p>
                            <p className="card-text">
                              <span className={`badge bg-${getStatusBadgeClass(r.statut)}`}>
                                {r.statut}
                              </span>
                            </p>
                            {r.commentaire_client && (
                              <p className="card-text">
                                <small className="text-muted">
                                  <strong>Commentaire client :</strong> {r.commentaire_client}
                                </small>
                              </p>
                            )}
                          </div>
                          <div className="col-md-6">
                            <div className="mb-2">
                              <label className="form-label">Changer le statut</label>
                              <Select
                                value={r.statut}
                                onChange={(e) => handleChangeStatus(r.id, e.target.value)}
                                options={[
                                  { value: 'en_attente', label: 'En attente' },
                                  { value: 'confirme', label: 'Confirmé' },
                                  { value: 'annule', label: 'Annulé' },
                                  { value: 'termine', label: 'Terminé' }
                                ]}
                              />
                            </div>
                            <div className="mb-2">
                              <label className="form-label">Commentaire entreprise</label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editingComment[r.id] || r.commentaire_entreprise || ''}
                                  onChange={(e) => setEditingComment({ ...editingComment, [r.id]: e.target.value })}
                                  placeholder="Ajouter un commentaire..."
                                />
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleUpdateComment(r.id)}
                                >
                                  Enregistrer
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
