import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../api/authContext'
import FooterLogo from '../components/FooterLogo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      console.error('Auth error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-600 to-white-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2x1 p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Gestion des Astreintes
        </h1>
        <p className="text-center text-gray-600 mb-6">Se connecter</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Pas encore de compte ? S'inscrire
          </Link>
        </div>
      </div>
      <FooterLogo />
    </div>
  )
}
