import React, { useEffect, useState } from 'react'
import SidebarClient from '../../components/layout/SidebarClient'
import { getClientReservations } from '../../services/clientApi'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function ClientDashboard() {
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
      setReservations(data)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des réservations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarClient />
        </div>
        <div className="col-md-9">
          <h3 className="mb-3">Mes réservations</h3>
          {loading && <Loader />}
          {error && <Alert type="danger">{error}</Alert>}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Entreprise</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.entreprise?.nom || '-'}</td>
                    <td>{r.service?.nom || '-'}</td>
                    <td>{formatDate(r.date)}</td>
                    <td>{formatTime(r.heure_debut)} - {formatTime(r.heure_fin)}</td>
                    <td>
                      <span className="badge bg-secondary text-uppercase">{r.statut}</span>
                    </td>
                  </tr>
                ))}
                {!loading && reservations.length === 0 && (
                  <tr>
                    <td colSpan="6">Aucune réservation pour le moment.</td>
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
