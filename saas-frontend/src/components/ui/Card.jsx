import React from 'react'

export default function Card({ title, children, footer, className = '' }) {
  return (
    <div className={`card mb-3 ${className}`}>
      {title && (
        <div className="card-header">
          <strong>{title}</strong>
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}
