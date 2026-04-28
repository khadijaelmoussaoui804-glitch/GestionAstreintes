import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../api/authContext'
import { useScheduleStore } from '../store/scheduleStore'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const { schedules, isLoading, fetchWeeklySchedule } = useScheduleStore()

  const [showServicesModal, setShowServicesModal] = useState(false)
  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState('')

  useEffect(() => {
    fetchWeeklySchedule(user?.service_id)
  }, [user?.service_id])

  const fetchServices = async () => {
    setIsLoadingServices(true)
    setServicesError('')
    try {
      const response = await fetch('/api/services', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur de chargement')
      setServices(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setServicesError(err.message)
    } finally {
      setIsLoadingServices(false)
    }
  }

  const handleOpenServices = () => {
    setShowServicesModal(true)
    fetchServices()
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Rôle</h3>
          <p className="text-2xl font-bold text-blue-600">
            {user?.role === 'user' && 'Utilisateur'}
            {user?.role === 'staff' && 'Utilisateur'}
            {user?.role === 'collaborator' && 'Collaborateur'}
            {user?.role === 'secretary' && 'Secrétaire'}
            {user?.role === 'admin' && 'Administrateur'}
          </p>
        </div>

        <div 
          onClick={handleOpenServices}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg hover:bg-gray-50 transition cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Service</h3>
          <p className="text-2xl font-bold text-blue-600">{user?.service?.name || 'N/A'}</p>
        </div>

        <Link to="/schedules" className="bg-white rounded-lg shadow p-6 block hover:shadow-lg hover:bg-gray-50 transition cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Planning cette semaine</h3>
          <p className="text-2xl font-bold text-blue-600">{schedules?.length || 0}</p>
        </Link>
      </div>

      {showServicesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-2xl font-bold text-gray-800">Tous les services</h2>
              <button
                onClick={() => setShowServicesModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
              >
                &times;
              </button>
            </div>
            
            {isLoadingServices ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : servicesError ? (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {servicesError}
              </div>
            ) : services.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun service trouvé.</p>
            ) : (
              <ul className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {services.map(service => (
                  <li key={service.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col">
                    <span className="font-semibold text-gray-800">{service.name}</span>
                    {service.description && (
                      <span className="text-sm text-gray-500 mt-1">{service.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}