import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SidebarClient from '../../components/layout/SidebarClient'
import { getClientReservations } from '../../services/clientApi'
import { useAuth } from '../../context/AuthContext'
import ReservationItem from '../../components/entreprises/ReservationItem'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import { extractResults } from '../../utils/pagination'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadReservations()
  }, [])

  async function loadReservations() {
    try {
      setLoading(true)
      const data = await getClientReservations()
      const results = extractResults(data)
      setReservations(results)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des réservations.')
    } finally {
      setLoading(false)
    }
  }

  const reservationsEnAttente = reservations.filter(r => r.statut === 'en_attente').length
  const reservationsConfirmees = reservations.filter(r => r.statut === 'confirme').length
  const reservationsTerminees = reservations.filter(r => r.statut === 'termine').length

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SidebarClient />
        </div>
        <div className="col-md-9 col-lg-10">
          {loading && <Loader />}
          {error && <Alert type="danger">{error}</Alert>}
          
          {!loading && !error && (
            <>
              {/* Header avec gradient */}
              <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="card-body text-white p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h2 className="mb-2 fw-bold">
                        <i className="bi bi-person-circle me-2" />
                        Bienvenue, {user?.username || 'Client'}
                      </h2>
                      <p className="mb-0 opacity-75">
                        Gérez vos réservations et découvrez de nouveaux services
                      </p>
                    </div>
                    <div className="col-md-4 text-end">
                      <span className="badge bg-light text-dark px-3 py-2">
                        <i className="bi bi-person-badge me-1" />
                        Espace Client
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 hover-shadow">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-circle bg-warning bg-opacity-10">
                          <i className="bi bi-clock-history text-warning fs-4"></i>
                        </div>
                        <h3 className="mb-0 text-warning fw-bold">{reservationsEnAttente}</h3>
                      </div>
                      <h6 className="text-muted mb-0">En attente</h6>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 hover-shadow">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-circle bg-success bg-opacity-10">
                          <i className="bi bi-check-circle-fill text-success fs-4"></i>
                        </div>
                        <h3 className="mb-0 text-success fw-bold">{reservationsConfirmees}</h3>
                      </div>
                      <h6 className="text-muted mb-0">Confirmées</h6>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 hover-shadow">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-circle bg-info bg-opacity-10">
                          <i className="bi bi-check2-all text-info fs-4"></i>
                        </div>
                        <h3 className="mb-0 text-info fw-bold">{reservationsTerminees}</h3>
                      </div>
                      <h6 className="text-muted mb-0">Terminées</h6>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 hover-shadow">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-circle bg-primary bg-opacity-10">
                          <i className="bi bi-calendar-check-fill text-primary fs-4"></i>
                        </div>
                        <h3 className="mb-0 text-primary fw-bold">{reservations.length}</h3>
                      </div>
                      <h6 className="text-muted mb-0">Total</h6>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liste des réservations */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pb-3">
                  <h4 className="mb-0">
                    <i className="bi bi-list-ul me-2 text-primary"></i>
                    Mes réservations
                  </h4>
                </div>
                <div className="card-body">
                  {reservations.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
                      <h5 className="text-muted">Aucune réservation</h5>
                      <p className="text-muted mb-4">
                        Vous n'avez pas encore de réservation. Parcourez les entreprises disponibles !
                      </p>
                      <Link to="/recherche" className="btn btn-primary">
                        <i className="bi bi-search me-2"></i>
                        Rechercher des entreprises
                      </Link>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {reservations.map((reservation) => (
                        <div key={reservation.id} className="col-12">
                          <ReservationItem reservation={reservation} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
