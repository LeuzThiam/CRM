export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-CA')
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  return timeStr.slice(0, 5) // HH:MM
}
