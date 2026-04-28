import { useEffect, useState } from 'react'
import { useAuth } from '../api/authContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AgentsPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Impossible de charger les utilisateurs.')
      }

      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user?.role || !['admin', 'manager'].includes(user.role)) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Vous n avez pas acces a cette page
        </div>
      </div>
    )
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Gestion des utilisateurs</h1>
          <p className="text-gray-600 mt-2">
            Les comptes affiches ici peuvent ensuite etre affectes aux astreintes dans la page Administration.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((account) => (
                  <tr key={account.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{account.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{account.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {account.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        account.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {account.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Aucun utilisateur disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
