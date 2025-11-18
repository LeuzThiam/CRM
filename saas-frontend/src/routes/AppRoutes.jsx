import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import HomePage from '../pages/Public/HomePage'
import LoginPage from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'
import SearchEntreprisesPage from '../pages/Public/SearchEntreprisesPage'
import EntrepriseDetailsPage from '../pages/Public/EntrepriseDetailsPage'
import ClientDashboard from '../pages/Client/ClientDashboard'
import EntrepriseDashboard from '../pages/Entreprise/EntrepriseDashboard'
import EntrepriseServicesPage from '../pages/Entreprise/EntrepriseServicesPage'
import EntrepriseDisponibilitesPage from '../pages/Entreprise/EntrepriseDisponibilitesPage'
import EntrepriseReservationsPage from '../pages/Entreprise/EntrepriseReservationsPage'
import { useAuth } from '../context/AuthContext'

// Routes protégées client
function PrivateRouteClient() {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (role !== 'client') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

// Routes protégées entreprise
function PrivateRouteEntreprise() {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (role !== 'entreprise') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recherche" element={<SearchEntreprisesPage />} />
      <Route path="/entreprises/:id" element={<EntrepriseDetailsPage />} />

      {/* Client */}
      <Route element={<PrivateRouteClient />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Route>

      {/* Entreprise */}
      <Route element={<PrivateRouteEntreprise />}>
        <Route path="/entreprise/dashboard" element={<EntrepriseDashboard />} />
        <Route path="/entreprise/services" element={<EntrepriseServicesPage />} />
        <Route path="/entreprise/disponibilites" element={<EntrepriseDisponibilitesPage />} />
        <Route path="/entreprise/reservations" element={<EntrepriseReservationsPage />} />
      </Route>
    </Routes>
  )
}
