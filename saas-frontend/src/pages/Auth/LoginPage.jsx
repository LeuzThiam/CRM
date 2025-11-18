import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import Loader from '../../components/ui/Loader'

export default function LoginPage() {
  const { login, loading, role, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ username: form.username, password: form.password })
      if (role === 'entreprise') {
        navigate('/entreprise/dashboard')
      } else {
        navigate('/client/dashboard')
      }
    } catch (err) {
      console.error(err)
      setError("Identifiants invalides ou erreur serveur.")
    }
  }

  if (loading && !isAuthenticated) {
    return <Loader />
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h2 className="mb-4 text-center">Connexion</h2>
          {error && <Alert type="danger">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Input
              label="Nom d'utilisateur"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <Input
              label="Mot de passe"
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className="d-grid">
              <Button type="submit">Se connecter</Button>
            </div>
          </form>
          <p className="mt-3 text-center">
            Pas de compte ? <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
