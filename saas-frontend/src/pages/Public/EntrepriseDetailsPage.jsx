import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getEntreprise,
  getEntrepriseServices,
  getEntrepriseDisponibilites
} from '../../services/entreprisesApi'
import { createReservation } from '../../services/clientApi'
import { useAuth } from '../../context/AuthContext'
import ServiceCard from '../../components/entreprises/ServiceCard'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function EntrepriseDetailsPage() {
  const { id } = useParams()
  const { isAuthenticated, role } = useAuth()

  const [entreprise, setEntreprise] = useState(null)
  const [services, setServices] = useState([])
  const [disponibilites, setDisponibilites] = useState([])
  const [dateFilter, setDateFilter] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [reservationComment, setReservationComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    loadBaseData()
  }, [id])

  async function loadBaseData() {
    try {
      setLoading(true)
      const [ent, serv] = await Promise.all([
        getEntreprise(id),
        getEntrepriseServices(id)
      ])
      setEntreprise(ent)
      const servicesResults = Array.isArray(serv) ? serv : (serv?.results || [])
      setServices(servicesResults)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des données.')
    } finally {
      setLoading(false)
    }
  }

  async function loadDisponibilites() {
    if (!dateFilter) return
    try {
      setLoading(true)
      const data = await getEntrepriseDisponibilites(id, dateFilter)
      const results = Array.isArray(data) ? data : (data?.results || [])
      setDisponibilites(results)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des disponibilités.')
    } finally {
      setLoading(false)
    }
  }

  const handleReserveClick = (slot) => {
    if (!isAuthenticated || role !== 'client') {
      setError('Vous devez être connecté en tant que client pour réserver.')
      return
    }
    if (!selectedService) {
      setError("Veuillez d'abord choisir un service.")
      return
    }
    setSelectedSlot(slot)
    setShowReservationForm(true)
  }

  const handleReserve = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    if (!selectedService || !selectedSlot) {
      setError('Veuillez sélectionner un service et un créneau.')
      return
    }
    
    try {
      const payload = {
        entreprise_id: Number(id),
        service_id: selectedService.id,
        date: selectedSlot.date,
        heure_debut: selectedSlot.heure_debut,
        commentaire_client: reservationComment
      }
      await createReservation(payload)
      setSuccess('Réservation créée avec succès (en attente de confirmation).')
      setShowReservationForm(false)
      setSelectedSlot(null)
      setReservationComment('')
      // Recharger les disponibilités
      if (dateFilter) {
        loadDisponibilites()
      }
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la création de la réservation.')
    }
  }

  if (loading && !entreprise) {
    return <Loader />
  }

  if (!entreprise) {
    return (
      <div className="container py-4">
        <Alert type="danger">Entreprise introuvable.</Alert>
      </div>
    )
  }

  return (
    <div className="container py-4">
      {/* Header de l'entreprise */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-md-8">
              <h2 className="mb-3 fw-bold">
                <i className="bi bi-building me-2 text-primary" />
                {entreprise.nom || 'Entreprise'}
              </h2>
              {entreprise.description && (
                <p className="text-muted mb-3">{entreprise.description}</p>
              )}
              
              <div className="row g-3 mb-3">
                {entreprise.domaine && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-tag-fill me-2 text-primary" />
                      <div>
                        <small className="text-muted d-block">Domaine</small>
                        <strong>{entreprise.domaine}</strong>
                      </div>
                    </div>
                  </div>
                )}
                {entreprise.ville && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill me-2 text-primary" />
                      <div>
                        <small className="text-muted d-block">Localisation</small>
                        <strong>{entreprise.ville}</strong>
                        {entreprise.adresse && <span className="text-muted"> — {entreprise.adresse}</span>}
                      </div>
                    </div>
                  </div>
                )}
                {entreprise.telephone && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-telephone-fill me-2 text-primary" />
                      <div>
                        <small className="text-muted d-block">Téléphone</small>
                        <strong>{entreprise.telephone}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex flex-column align-items-end gap-2">
                {entreprise.est_valide ? (
                  <span className="badge bg-success px-3 py-2">
                    <i className="bi bi-check-circle-fill me-1" />
                    Entreprise validée
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark px-3 py-2">
                    <i className="bi bi-clock-fill me-1" />
                    En attente de validation
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h4>Services proposés</h4>
          {services.map((s) => (
            <div key={s.id} onClick={() => setSelectedService(s)} className="mb-2">
              <ServiceCard
                service={s}
                onSelect={(service) => setSelectedService(service)}
              />
              {selectedService?.id === s.id && (
                <small className="text-success">Service sélectionné</small>
              )}
            </div>
          ))}
        </div>

        <div className="col-md-6">
          <h4>Disponibilités</h4>
          <form
            className="d-flex gap-2 mb-3"
            onSubmit={(e) => {
              e.preventDefault()
              loadDisponibilites()
            }}
          >
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="submit">
              <i className="bi bi-search me-1" />
              Voir les créneaux
            </button>
          </form>

          {error && <Alert type="danger">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          {loading && <Loader />}

          <ul className="list-group">
            {disponibilites.map((slot) => (
              <li key={slot.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div>
                    <strong>{formatDate(slot.date)}</strong>
                  </div>
                  <div>
                    {formatTime(slot.heure_debut)} - {formatTime(slot.heure_fin)}
                  </div>
                  <small className="text-muted">
                    Capacité : {slot.capacite}
                  </small>
                </div>
                {isAuthenticated && role === 'client' ? (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleReserveClick(slot)}
                  >
                    Réserver
                  </button>
                ) : (
                  <span className="text-muted">Connectez-vous pour réserver</span>
                )}
              </li>
            ))}
            {!loading && disponibilites.length === 0 && (
              <li className="list-group-item">Aucun créneau disponible.</li>
            )}
          </ul>

          {showReservationForm && selectedSlot && (
            <div className="card mt-3">
              <div className="card-header">
                <h5 className="mb-0">Formulaire de réservation</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleReserve}>
                  <div className="mb-3">
                    <label className="form-label">Service sélectionné</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedService?.nom || ''}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date et heure</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${formatDate(selectedSlot.date)} à ${formatTime(selectedSlot.heure_debut)} - ${formatTime(selectedSlot.heure_fin)}`}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Commentaire (optionnel)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reservationComment}
                      onChange={(e) => setReservationComment(e.target.value)}
                      placeholder="Ajoutez un commentaire pour votre réservation..."
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Confirmer la réservation
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setShowReservationForm(false)
                        setSelectedSlot(null)
                        setReservationComment('')
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
