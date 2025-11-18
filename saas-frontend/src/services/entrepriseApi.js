import apiClient from './apiClient'

export async function getMonProfilEntreprise() {
  const response = await apiClient.get('/entreprise/mon-profil/')
  return response.data
}

export async function updateMonProfilEntreprise(data) {
  const response = await apiClient.put('/entreprise/mon-profil/', data)
  return response.data
}

// Services
export async function getEntrepriseServicesMe() {
  const response = await apiClient.get('/entreprise/services/')
  return response.data
}

export async function createEntrepriseService(data) {
  const response = await apiClient.post('/entreprise/services/', data)
  return response.data
}

export async function updateEntrepriseService(id, data) {
  const response = await apiClient.put(`/entreprise/services/${id}/`, data)
  return response.data
}

export async function deleteEntrepriseService(id) {
  const response = await apiClient.delete(`/entreprise/services/${id}/`)
  return response.data
}

// Disponibilités
export async function getEntrepriseDisponibilitesMe() {
  const response = await apiClient.get('/entreprise/disponibilites/')
  return response.data
}

export async function createEntrepriseDisponibilite(data) {
  const response = await apiClient.post('/entreprise/disponibilites/', data)
  return response.data
}

export async function deleteEntrepriseDisponibilite(id) {
  const response = await apiClient.delete(`/entreprise/disponibilites/${id}/`)
  return response.data
}

// Réservations
export async function getEntrepriseReservationsMe() {
  const response = await apiClient.get('/entreprise/reservations/')
  return response.data
}

export async function updateReservationStatut(id, data) {
  const response = await apiClient.patch(`/entreprise/reservations/${id}/`, data)
  return response.data
}
