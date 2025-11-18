import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'

export default function EntrepriseCard({ entreprise }) {
  return (
    <Card
      title={entreprise.nom}
      footer={
        <Link to={`/entreprises/${entreprise.id}`} className="btn btn-sm btn-outline-primary">
          Voir les détails
        </Link>
      }
    >
      <p className="mb-1">
        <i className="bi bi-geo-alt me-1" />
        {entreprise.ville} — {entreprise.adresse}
      </p>
      <p className="mb-1">
        <strong>Domaine :</strong> {entreprise.domaine}
      </p>
      <p className="mb-0 text-muted">{entreprise.description}</p>
    </Card>
  )
}
