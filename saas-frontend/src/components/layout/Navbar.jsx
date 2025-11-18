import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg modern-navbar">
      <div className="container">
        <Link className="navbar-brand modern-brand" to="/">
          <div className="brand-icon">
            <i className="bi bi-calendar-check-fill" />
          </div>
          <span className="brand-text">SaaS Rendez-vous</span>
        </Link>
        <button
          className="navbar-toggler modern-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link modern-nav-link ${isActive ? 'active' : ''}`
                } 
                to="/"
              >
                <i className="bi bi-house-door me-1" />
                Accueil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link modern-nav-link ${isActive ? 'active' : ''}`
                } 
                to="/recherche"
              >
                <i className="bi bi-search me-1" />
                Recherche
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => 
                    `nav-link modern-nav-link ${isActive ? 'active' : ''}`
                  }
                  to={role === 'client' ? '/client/dashboard' : '/entreprise/dashboard'}
                >
                  <i className="bi bi-speedometer2 me-1" />
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link modern-nav-link ${isActive ? 'active' : ''}`
                    } 
                    to="/login"
                  >
                    <i className="bi bi-box-arrow-in-right me-1" />
                    Connexion
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link modern-nav-link btn-nav-link ${isActive ? 'active' : ''}`
                    } 
                    to="/register"
                  >
                    <i className="bi bi-person-plus me-1" />
                    Inscription
                  </NavLink>
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle modern-user-dropdown"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="user-avatar">
                      <i className="bi bi-person-circle" />
                    </div>
                    <div className="user-info d-none d-md-inline-block ms-2">
                      <div className="user-name">{user?.username || 'Utilisateur'}</div>
                      <div className="user-role">
                        <span className={`badge badge-${role === 'client' ? 'info' : 'primary'}`}>
                          {role === 'client' ? '👤 Client' : '🏢 Entreprise'}
                        </span>
                      </div>
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end modern-dropdown" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to={role === 'client' ? '/client/dashboard' : '/entreprise/dashboard'}>
                        <i className="bi bi-speedometer2 me-2" />
                        Dashboard
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2" />
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
