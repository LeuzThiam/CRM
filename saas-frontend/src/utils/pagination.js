/**
 * Extrait les résultats d'une réponse paginée ou d'un tableau simple
 * @param {Array|Object} data - Données de l'API (tableau ou objet paginé)
 * @returns {Array} - Tableau des résultats
 */
export function extractResults(data) {
  if (!data) return []
  // Si c'est un objet paginé (avec results)
  if (typeof data === 'object' && !Array.isArray(data) && data.results) {
    return data.results
  }
  // Si c'est déjà un tableau
  if (Array.isArray(data)) {
    return data
  }
  // Sinon, retourner un tableau vide
  return []
}

/**
 * Extrait les métadonnées de pagination
 * @param {Object} data - Données de l'API
 * @returns {Object} - Métadonnées de pagination
 */
export function extractPagination(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { count: 0, next: null, previous: null }
  }
  return {
    count: data.count || 0,
    next: data.next || null,
    previous: data.previous || null,
  }
}

