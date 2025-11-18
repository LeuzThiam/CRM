import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SidebarEntreprise() {

  return (
    <div 
      className="sidebar-entreprise"
      style={{
        position: 'sticky',
        top: '20px',
        height: 'fit-content',
        zIndex: 100
      }}
    >
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pb-3 pt-3">
          <h6 className="mb-0 text-muted text-uppercase small fw-bold">
            <i className="bi bi-grid-3x3-gap me-2" />
            Navigation
          </h6>
        </div>
        <div className="card-body p-0">
          <nav className="nav flex-column">
            <NavLink
              to="/entreprise/dashboard"
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="d-flex align-items-center">
                <div className="sidebar-icon">
                  <i className="bi bi-speedometer2" />
                </div>
                <span className="ms-3">Tableau de bord</span>
              </div>
            </NavLink>

            <NavLink
              to="/entreprise/services"
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="d-flex align-items-center">
                <div className="sidebar-icon">
                  <i className="bi bi-briefcase" />
                </div>
                <span className="ms-3">Services</span>
              </div>
            </NavLink>

            <NavLink
              to="/entreprise/disponibilites"
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="d-flex align-items-center">
                <div className="sidebar-icon">
                  <i className="bi bi-calendar-range" />
                </div>
                <span className="ms-3">Disponibilités</span>
              </div>
            </NavLink>

            <NavLink
              to="/entreprise/reservations"
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="d-flex align-items-center">
                <div className="sidebar-icon">
                  <i className="bi bi-people" />
                </div>
                <span className="ms-3">Réservations</span>
              </div>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}
