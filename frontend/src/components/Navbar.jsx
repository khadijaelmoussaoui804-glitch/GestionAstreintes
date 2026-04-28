import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          Gestion des Astreintes
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="hover:text-blue-200 transition">
            Accueil
          </Link>
          <Link to="/schedules" className="hover:text-blue-200 transition">
            Plannings
          </Link>
          <Link to="/unavailability" className="hover:text-blue-200 transition">
            Indisponibilité
          </Link>
          
          {user?.role === 'secretary' && (
            <Link to="/agents" className="hover:text-blue-200 transition">
              Agents
            </Link>
          )}
          
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-blue-200 transition">
              Admin
            </Link>
          )}

          <div className="flex items-center gap-4 border-l border-blue-400 pl-4">
            <span className="text-sm">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
