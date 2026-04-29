import { useState, useEffect } from 'react'
import { useAuth } from '../api/authContext'
import { useAgentStore } from '../store/agentStore'
import LoadingSpinner from '../components/LoadingSpinner'

export default function UnavailabilityPage() {
  const { user } = useAuth()
  const { declareUnavailability, isLoading, error } = useAgentStore()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [reason, setReason] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  if (!['staff', 'user'].includes(user?.role)) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Cette page est reservee aux utilisateurs.
        </div>
      </div>
    )
  }
  const handleSubmit = async (e) => {
  e.preventDefault()
  
  try {
    await declareUnavailability(user.id, date, reason)  // ← user.id au lieu de user.agent.id
    
    setSuccessMessage('Indisponibilité enregistrée avec succès')
    setDate(new Date().toISOString().split('T')[0])
    setReason('')
    
    setTimeout(() => setSuccessMessage(''), 3000)
  } catch (err) {
    console.error('Error:', err)
  }
}

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Déclarer une indisponibilité</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nouvelle indisponibilité</h2>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    Tu as dépassé l'heure disponible de déclaration.
  </div>
)}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Raison</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="4"
                placeholder="Raison de l'indisponibilité (optionnel)"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informations</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                <strong>Nom:</strong> {user?.name}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Service:</strong> {user?.service?.name || 'Non assigné'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Email:</strong> {user?.email}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-blue-900 mb-2">À savoir:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Déclarez votre indisponibilité au moins 2 jours avant</li>
                <li>✓ Le système tendra à vous éviter pour cette date</li>
                <li>✓ Votre secrétaire sera notifié de votre indisponibilité</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}