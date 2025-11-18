import React from 'react'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function ReservationItem({ reservation }) {
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
    <div className="card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h5 className="card-title">
              {reservation.entreprise?.nom || 'Entreprise'} - {reservation.service?.nom || 'Service'}
            </h5>
            <p className="card-text mb-1">
              <i className="bi bi-calendar me-1" />
              {formatDate(reservation.date)} à {formatTime(reservation.heure_debut)} - {formatTime(reservation.heure_fin)}
            </p>
            {reservation.commentaire_client && (
              <p className="card-text">
                <small className="text-muted">
                  <strong>Mon commentaire :</strong> {reservation.commentaire_client}
                </small>
              </p>
            )}
            {reservation.commentaire_entreprise && (
              <p className="card-text">
                <small className="text-muted">
                  <strong>Commentaire entreprise :</strong> {reservation.commentaire_entreprise}
                </small>
              </p>
            )}
          </div>
          <div className="col-md-4 text-end">
            <span className={`badge bg-${getStatusBadgeClass(reservation.statut)} mb-2`}>
              {reservation.statut}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
