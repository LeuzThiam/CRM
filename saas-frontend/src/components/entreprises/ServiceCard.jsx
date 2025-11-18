import React from 'react'
import Card from '../ui/Card'

export default function ServiceCard({ service, onSelect }) {
  return (
    <Card
      title={service.nom}
      footer={
        onSelect && (
          <button className="btn btn-sm btn-primary" onClick={() => onSelect(service)}>
            Choisir ce service
          </button>
        )
      }
    >
      <p className="mb-1">{service.description}</p>
      <p className="mb-1">
        <strong>Durée :</strong> {service.duree_minutes} min
      </p>
      <p className="mb-0">
        <strong>Prix :</strong> {service.prix} $
      </p>
    </Card>
  )
}
