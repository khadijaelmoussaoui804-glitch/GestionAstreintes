import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../api/authContext'
import FooterLogo from '../components/FooterLogo'

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const VALID_ROLES = ['user', 'admin']

const ROLE_LABELS = {
  user:  'Utilisateur',
  admin: 'Administrateur',
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')          // ← empty so the placeholder shows
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [roleError, setRoleError] = useState('')

  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  // ─── Validators ──────────────────────────────────────────────────────────────
  const validateName = (value) => {
    if (!value) return 'Le nom est obligatoire.'
    if (value.length < 2) return 'Le nom doit contenir au moins 2 caractères.'
    return ''
  }

  const validateEmail = (value) => {
    if (!value) return "L'email est obligatoire."
    if (!EMAIL_REGEX.test(value)) return 'Veuillez entrer une adresse email valide.'
    return ''
  }

  const validatePassword = (value) => {
    if (!value) return 'Le mot de passe est obligatoire.'
    if (!PASSWORD_REGEX.test(value))
      return 'Le mot de passe doit contenir au moins 8 caractères avec au moins une lettre et un chiffre.'
    return ''
  }

  const validateRole = (value) => {
    if (!value) return 'Le rôle est obligatoire.'
    if (!VALID_ROLES.includes(value)) return 'Veuillez choisir un rôle valide.'
    return ''
  }

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextNameError     = validateName(name)
    const nextEmailError    = validateEmail(email)
    const nextPasswordError = validatePassword(password)
    const nextRoleError     = validateRole(role)

    setNameError(nextNameError)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setRoleError(nextRoleError)
    if (nextNameError || nextEmailError || nextPasswordError || nextRoleError) return
    try {
      await register({ name, email, password, role })
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
    }
  }
  const firstError = nameError || emailError || passwordError || roleError || error
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Gestion des Astreintes
        </h1>
        <p className="text-center text-gray-600 mb-6">Créer un compte</p>
        {firstError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {firstError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(validateName(e.target.value)) }}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                nameError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-600'
              }`}
              placeholder="Votre nom"
            />
            {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)) }}
              required
              autoComplete="email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                emailError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-600'
              }`}
              placeholder="votre@email.com"
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(validatePassword(e.target.value)) }}
              required
              autoComplete="new-password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                passwordError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-600'
              }`}
              placeholder="********"
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>

          {/* Role — fixed: empty default, all system roles listed */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Rôle</label>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setRoleError(validateRole(e.target.value)) }}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                roleError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-600'
              }`}
            >
              <option value="" disabled>Choisir un rôle...</option>
              {VALID_ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            {roleError && <p className="mt-1 text-sm text-red-600">{roleError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Créer un compte'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Déjà inscrit ? Se connecter
          </Link>
        </div>
      </div>
      <FooterLogo />
    </div>
  )
}