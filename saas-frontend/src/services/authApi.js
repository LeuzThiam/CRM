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
export async function registerApi({ 
  username, 
  email, 
  password, 
  role,
  nom_entreprise,
  description_entreprise,
  domaine_entreprise,
  adresse_entreprise,
  ville_entreprise,
  telephone_entreprise
}) {
  const payload = {
    username,
    email,
    password,
    role,
  }

  // Ajouter les champs entreprise si le rôle est entreprise
  if (role === 'entreprise') {
    if (nom_entreprise) payload.nom_entreprise = nom_entreprise
    if (description_entreprise) payload.description_entreprise = description_entreprise
    if (domaine_entreprise) payload.domaine_entreprise = domaine_entreprise
    if (adresse_entreprise) payload.adresse_entreprise = adresse_entreprise
    if (ville_entreprise) payload.ville_entreprise = ville_entreprise
    if (telephone_entreprise) payload.telephone_entreprise = telephone_entreprise
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
