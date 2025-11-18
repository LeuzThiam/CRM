import apiClient from './apiClient'

export async function listEntreprises(params = {}) {
  const response = await apiClient.get('/entreprises/', { params })
  return response.data
}

export async function getEntreprise(id) {
  const response = await apiClient.get(`/entreprises/${id}/`)
  return response.data
}

export async function getEntrepriseServices(id) {
  const response = await apiClient.get(`/entreprises/${id}/services/`)
  return response.data
}

export async function getEntrepriseDisponibilites(id, date) {
  const response = await apiClient.get(`/entreprises/${id}/disponibilites/`, {
    params: { date }
  })
  return response.data
}
