import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SidebarEntreprise() {
  return (
    <div className="list-group mb-3">
      <NavLink to="/entreprise/dashboard" className="list-group-item list-group-item-action">
        <i className="bi bi-speedometer2 me-2" />
        Tableau de bord
      </NavLink>
      <NavLink to="/entreprise/services" className="list-group-item list-group-item-action">
        <i className="bi bi-briefcase me-2" />
        Services
      </NavLink>
      <NavLink to="/entreprise/disponibilites" className="list-group-item list-group-item-action">
        <i className="bi bi-calendar-range me-2" />
        Disponibilités
      </NavLink>
      <NavLink to="/entreprise/reservations" className="list-group-item list-group-item-action">
        <i className="bi bi-people me-2" />
        Réservations
      </NavLink>
    </div>
  )
}
