import React from 'react'

export default function Input({
  label,
  id,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input id={id} type={type} className={`form-control ${className}`} {...props} />
    </div>
  )
}
