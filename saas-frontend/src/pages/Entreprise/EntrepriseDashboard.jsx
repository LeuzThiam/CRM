import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SidebarEntreprise from '../../components/layout/SidebarEntreprise'
import { getMonProfil, getMesServices, getMesReservations } from '../../services/entrepriseApi'
import Alert from '../../components/ui/Alert'
import Loader from '../../components/ui/Loader'
import { extractResults } from '../../utils/pagination'

export default function EntrepriseDashboard() {
  const [profil, setProfil] = useState(null)
  const [servicesCount, setServicesCount] = useState(0)
  const [reservationsEnAttente, setReservationsEnAttente] = useState(0)
  const [reservationsTotal, setReservationsTotal] = useState(0)
  const [reservationsConfirmees, setReservationsConfirmees] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [profilData, servicesData, reservationsData] = await Promise.all([
        getMonProfil(),
        getMesServices(),
        getMesReservations()
      ])
      setProfil(profilData)
      
      const services = extractResults(servicesData)
      const reservations = extractResults(reservationsData)
      
      setServicesCount(services.length || 0)
      setReservationsTotal(reservations.length || 0)
      setReservationsEnAttente(
        reservations.filter((r) => r.statut === 'en_attente').length || 0
      )
      setReservationsConfirmees(
        reservations.filter((r) => r.statut === 'confirme').length || 0
      )
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des données.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SidebarEntreprise />
        </div>
        <div className="col-md-9 col-lg-10">
          {loading && <Loader />}
          {error && <Alert type="danger">{error}</Alert>}
          
          {profil && (
            <>
              {/* Header avec gradient */}
              <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="card-body text-white p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h2 className="mb-2 fw-bold">
                        <i className="bi bi-building me-2" />
                        {profil.nom || 'Mon Entreprise'}
                      </h2>
                      <p className="mb-1 opacity-75">
                        <i className="bi bi-geo-alt-fill me-2" />
                        {profil.ville} — {profil.adresse}
                      </p>
                      <p className="mb-0">
                        <span className="badge bg-light text-dark me-2">
                          <i className="bi bi-tag-fill me-1" />
                          {profil.domaine}
                        </span>
                        {profil.est_valide ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle-fill me-1" />
                            Validée
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-clock-fill me-1" />
                            En attente de validation
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="d-flex flex-column align-items-end gap-2">
                        <span className="badge bg-light text-dark px-3 py-2">
                          <i className="bi bi-building-check me-1" />
                          Espace Entreprise
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques principales */}
              <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 hover-shadow" style={{ transition: 'all 0.3s ease' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-circle bg-primary bg-opacity-10">
                          <i className="bi bi-briefcase-fill text-primary fs-4"></i>
                        </div>
                        <h3 className="mb-0 text-primary fw-bold">{servicesCount}</h3>
                      </div>
                      <h6 className="text-muted mb-3">Services actifs</h6>
                      <Link to="/entreprise/services" className="btn btn-outline-primary btn-sm w-100">
                        <i className="bi bi-arrow-right-circle me-1" />
                        Gérer les services
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 hover-shadow" style={{ transition: 'all 0.3s ease' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-circle bg-warning bg-opacity-10">
                          <i className="bi bi-clock-history text-warning fs-4"></i>
                        </div>
                        <h3 className="mb-0 text-warning fw-bold">{reservationsEnAttente}</h3>
                      </div>
                      <h6 className="text-muted mb-3">En attente</h6>
                      <Link to="/entreprise/reservations" className="btn btn-outline-warning btn-sm w-100">
                        <i className="bi bi-arrow-right-circle me-1" />
                        Voir les réservations
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 hover-shadow" style={{ transition: 'all 0.3s ease' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-circle bg-success bg-opacity-10">
                          <i className="bi bi-check-circle-fill text-success fs-4"></i>
                        </div>
                        <h3 className="mb-0 text-success fw-bold">{reservationsConfirmees}</h3>
                      </div>
                      <h6 className="text-muted mb-3">Confirmées</h6>
                      <Link to="/entreprise/reservations" className="btn btn-outline-success btn-sm w-100">
                        <i className="bi bi-arrow-right-circle me-1" />
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 hover-shadow" style={{ transition: 'all 0.3s ease' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-circle bg-info bg-opacity-10">
                          <i className="bi bi-calendar-check-fill text-info fs-4"></i>
                        </div>
                        <h3 className="mb-0 text-info fw-bold">{reservationsTotal}</h3>
                      </div>
                      <h6 className="text-muted mb-3">Total réservations</h6>
                      <Link to="/entreprise/reservations" className="btn btn-outline-info btn-sm w-100">
                        <i className="bi bi-arrow-right-circle me-1" />
                        Voir tout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 pb-0">
                      <h5 className="mb-0">
                        <i className="bi bi-lightning-charge-fill text-warning me-2" />
                        Actions rapides
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        <Link to="/entreprise/services" className="btn btn-outline-primary">
                          <i className="bi bi-plus-circle-fill me-2" />
                          Ajouter un nouveau service
                        </Link>
                        <Link to="/entreprise/disponibilites" className="btn btn-outline-primary">
                          <i className="bi bi-calendar-plus-fill me-2" />
                          Ajouter des disponibilités
                        </Link>
                        <Link to="/entreprise/reservations" className="btn btn-outline-primary">
                          <i className="bi bi-list-check me-2" />
                          Gérer les réservations
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 pb-0">
                      <h5 className="mb-0">
                        <i className="bi bi-info-circle-fill text-info me-2" />
                        Informations
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Description</small>
                        <p className="mb-0">{profil.description || 'Aucune description disponible.'}</p>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Téléphone</small>
                        <p className="mb-0">
                          <i className="bi bi-telephone-fill me-1" />
                          {profil.telephone || 'Non renseigné'}
                        </p>
                      </div>
                      <div>
                        <small className="text-muted d-block mb-1">Date de création</small>
                        <p className="mb-0">
                          <i className="bi bi-calendar-event me-1" />
                          {new Date(profil.date_creation).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
