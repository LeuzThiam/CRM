import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-5 fw-bold mb-3">
              Plateforme SaaS de prise de rendez-vous
            </h1>
            <p className="lead">
              Mettez en relation des clients et des entreprises de tous secteurs
              (mécanique, coiffure, consulting, etc.) grâce à une interface simple,
              moderne et responsive.
            </p>
            <div className="d-flex gap-2 mt-3">
              <Link to="/recherche" className="btn btn-primary btn-lg">
                <i className="bi bi-search me-2" />
                Trouver une entreprise
              </Link>
              <Link to="/register" className="btn btn-outline-secondary btn-lg">
                Devenir entreprise partenaire
              </Link>
            </div>
          </div>
          <div className="col-md-6 d-none d-md-block text-center">
            <i className="bi bi-calendar4-week display-1 text-primary" />
            <p className="mt-3 text-muted">
              Gestion des services, des créneaux de disponibilité et des réservations
              en quelques clics.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
