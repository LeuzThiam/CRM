import React from 'react'

export default function Loader() {
  return (
    <div className="d-flex justify-content-center my-4">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  )
}
