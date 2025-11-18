import apiClient from './apiClient'

export async function getClientReservations() {
  const response = await apiClient.get('/client/reservations/')
  return response.data
}

export async function createReservation(payload) {
  const response = await apiClient.post('/reservations/', payload)
  return response.data
}
