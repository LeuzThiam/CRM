import React from 'react'
import { Link } from 'react-router-dom'

export default function EntrepriseCard({ entreprise }) {
  return (
    <div className="card border-0 shadow-sm h-100 hover-shadow enterprise-card">
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="flex-grow-1">
            <h5 className="card-title fw-bold mb-2">{entreprise.nom}</h5>
            <span className="badge bg-primary bg-opacity-10 text-primary">
              <i className="bi bi-tag-fill me-1" />
              {entreprise.domaine}
            </span>
          </div>
          <div className="entreprise-icon">
            <i className="bi bi-building text-primary" />
          </div>
        </div>
        
        <p className="text-muted mb-3 small">
          {entreprise.description || 'Aucune description disponible.'}
        </p>
        
        <div className="entreprise-info mb-3">
          <div className="d-flex align-items-center text-muted mb-2">
            <i className="bi bi-geo-alt-fill me-2 text-primary" />
            <small>{entreprise.ville}</small>
          </div>
          {entreprise.adresse && (
            <div className="d-flex align-items-center text-muted">
              <i className="bi bi-pin-map-fill me-2 text-primary" />
              <small>{entreprise.adresse}</small>
            </div>
          )}
        </div>
        
        <Link 
          to={`/entreprises/${entreprise.id}`} 
          className="btn btn-primary w-100 mt-3"
        >
          <i className="bi bi-arrow-right-circle me-2" />
          Voir les détails
        </Link>
      </div>
    </div>
  )
}
