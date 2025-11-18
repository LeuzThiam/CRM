import React, { useEffect, useState } from 'react'
import SidebarEntreprise from '../../components/layout/SidebarEntreprise'
import { getMonProfilEntreprise } from '../../services/entrepriseApi'
import Alert from '../../components/ui/Alert'
import Loader from '../../components/ui/Loader'

export default function EntrepriseDashboard() {
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProfil()
  }, [])

  async function loadProfil() {
    try {
      const data = await getMonProfilEntreprise()
      setProfil(data)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement du profil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-3">
          <SidebarEntreprise />
        </div>
        <div className="col-md-9">
          <h3 className="mb-3">Tableau de bord entreprise</h3>
          {loading && <Loader />}
          {error && <Alert type="danger">{error}</Alert>}
          {profil && (
            <>
              <p>
                <strong>Nom :</strong> {profil.nom}
              </p>
              <p>
                <strong>Domaine :</strong> {profil.domaine}
              </p>
              <p>
                <strong>Adresse :</strong> {profil.adresse}, {profil.ville}
              </p>
              <p>
                <strong>Téléphone :</strong> {profil.telephone}
              </p>
              <p>
                <strong>Validée :</strong> {profil.est_valide ? 'Oui' : 'Non'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
