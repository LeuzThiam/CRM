import apiClient from './apiClient'

// Profil entreprise
export async function getMonProfil() {
  const response = await apiClient.get('/entreprise/mon-profil/')
  return response.data
}

export async function updateMonProfil(data) {
  const response = await apiClient.put('/entreprise/mon-profil/', data)
  return response.data
}

// Services
export async function getMesServices() {
  const response = await apiClient.get('/entreprise/services/')
  return response.data
}

export async function createService(data) {
  const response = await apiClient.post('/entreprise/services/', data)
  return response.data
}

export async function updateService(id, data) {
  const response = await apiClient.put(`/entreprise/services/${id}/`, data)
  return response.data
}

export async function deleteService(id) {
  const response = await apiClient.delete(`/entreprise/services/${id}/`)
  return response.data
}

// Disponibilités
export async function getMesDisponibilites() {
  const response = await apiClient.get('/entreprise/disponibilites/')
  return response.data
}

export async function createDisponibilite(data) {
  const response = await apiClient.post('/entreprise/disponibilites/', data)
  return response.data
}

export async function deleteDisponibilite(id) {
  const response = await apiClient.delete(`/entreprise/disponibilites/${id}/`)
  return response.data
}

// Réservations
export async function getMesReservations() {
  const response = await apiClient.get('/entreprise/reservations/')
  return response.data
}

export async function updateReservation(id, data) {
  const response = await apiClient.patch(`/entreprise/reservations/${id}/`, data)
  return response.data
}
