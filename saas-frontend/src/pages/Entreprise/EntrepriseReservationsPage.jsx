import React, { useEffect, useState } from 'react'
import SidebarEntreprise from '../../components/layout/SidebarEntreprise'
import { getEntrepriseReservationsMe, updateReservationStatut } from '../../services/entrepriseApi'
import Loader from '../../components/ui/Loader'
import Alert from '../../components/ui/Alert'
import ReservationItem from '../../components/entreprises/ReservationItem'

export default function EntrepriseReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadReservations()
  }, [])

  async function loadReservations() {
    try {
      setLoading(true)
      const data = await getEntrepriseReservationsMe()
      setReservations(data)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des réservations.')
    } finally {
      setLoading(false)
    }
  }

  async function handleChangeStatus(id, statut) {
    try {
      await updateReservationStatut(id, { statut })
      await loadReservations()
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la mise à jour du statut.')
    }
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarEntreprise />
        </div>
        <div className="col-md-9">
          <h3 className="mb-3">Réservations reçues</h3>
          {error && <Alert type="danger">{error}</Alert>}
          {loading && <Loader />}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <ReservationItem
                    key={r.id}
                    reservation={r}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
                {!loading && reservations.length === 0 && (
                  <tr>
                    <td colSpan="7">Aucune réservation pour le moment.</td>
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
