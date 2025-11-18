import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SidebarClient() {
  return (
    <div className="list-group mb-3">
      <NavLink to="/client/dashboard" className="list-group-item list-group-item-action">
        <i className="bi bi-speedometer2 me-2" />
        Tableau de bord
      </NavLink>
    </div>
  )
}
