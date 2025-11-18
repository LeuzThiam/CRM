import apiClient from './apiClient'

// -----------------------------
// LOGIN
// -----------------------------
export async function loginApi({ username, email, password }) {
  // Le backend accepte email OU username dans un même champ
  // On envoie uniquement ce que le user a rempli
  const payload = {
    password,
  }

  if (email && email !== "") {
    payload.email = email
  }

  if (username && username !== "") {
    payload.username = username
  }

  const response = await apiClient.post('/auth/login/', payload)
  return response.data
}

// -----------------------------
// REGISTER
// -----------------------------
export async function registerApi({ username, email, password, role }) {
  // Le backend Django attend exactement :
  // username, email, password, role
  const payload = {
    username,
    email,
    password,
    role,
  }

  const response = await apiClient.post('/auth/register/', payload)
  return response.data // renvoie : id, username, email, role, access, refresh
}

// -----------------------------
// ME (User + Profil)
// -----------------------------
export async function getMe() {
  const response = await apiClient.get('/auth/me/')
  return response.data // renvoie : { user: {...}, profile: {...} }
}
