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
      setServices(serv)
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
      setDisponibilites(data)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des disponibilités.')
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = async (slot) => {
    setError(null)
    setSuccess(null)
    if (!isAuthenticated || role !== 'client') {
      setError('Vous devez être connecté en tant que client pour réserver.')
      return
    }
    if (!selectedService) {
      setError('Veuillez d’abord choisir un service.')
      return
    }
    try {
      const payload = {
        entreprise_id: Number(id),
        service_id: selectedService.id,
        date: slot.date,
        heure_debut: slot.heure_debut,
        commentaire_client: ''
      }
      await createReservation(payload)
      setSuccess('Réservation créée avec succès (en attente de confirmation).')
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
      <h2 className="mb-3">{entreprise.nom}</h2>
      <p className="mb-1">
        <i className="bi bi-geo-alt me-1" />
        {entreprise.ville} — {entreprise.adresse}
      </p>
      <p className="mb-1">
        <strong>Domaine :</strong> {entreprise.domaine}
      </p>
      <p className="mb-3 text-muted">{entreprise.description}</p>

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
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleReserve(slot)}
                >
                  Réserver
                </button>
              </li>
            ))}
            {!loading && disponibilites.length === 0 && (
              <li className="list-group-item">Aucun créneau disponible.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
