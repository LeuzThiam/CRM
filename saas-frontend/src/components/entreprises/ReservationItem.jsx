import React from 'react'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function ReservationItem({ reservation, onChangeStatus }) {
  return (
    <tr>
      <td>{reservation.id}</td>
      <td>{reservation.client?.user?.username || reservation.client_name || '-'}</td>
      <td>{reservation.service?.nom || '-'}</td>
      <td>{formatDate(reservation.date)}</td>
      <td>{formatTime(reservation.heure_debut)} - {formatTime(reservation.heure_fin)}</td>
      <td>
        <span className="badge bg-secondary text-uppercase">{reservation.statut}</span>
      </td>
      <td>
        {onChangeStatus && (
          <div className="btn-group btn-group-sm" role="group">
            <button
              className="btn btn-outline-success"
              onClick={() => onChangeStatus(reservation.id, 'confirme')}
            >
              Confirmer
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => onChangeStatus(reservation.id, 'annule')}
            >
              Annuler
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => onChangeStatus(reservation.id, 'termine')}
            >
              Terminer
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
