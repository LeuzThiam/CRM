import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-light py-3 mt-4 border-top">
      <div className="container text-center">
        <small>
          &copy; {new Date().getFullYear()} SaaS Rendez-vous — Plateforme de prise de rendez-vous.
        </small>
      </div>
    </footer>
  )
}
