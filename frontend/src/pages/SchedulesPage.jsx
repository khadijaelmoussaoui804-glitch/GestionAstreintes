import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScheduleStore } from '../store/scheduleStore'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../api/authContext'

const parseApiResponse = async (response, fallbackMessage) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const data = await response.json()
    if (!response.ok) {
      const firstValidationError = data.errors
        ? Object.values(data.errors).flat()[0]
        : null
      throw new Error(firstValidationError || data.error || data.message || fallbackMessage)
    }
    return data
  }
  await response.text()
  throw new Error(fallbackMessage)
}
export default function SchedulesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { schedules, isLoading, error, fetchWeeklySchedule } = useScheduleStore()
  const [weekStart, setWeekStart] = useState(new Date().toISOString().split('T')[0])
  // ─── Shift modal state ───────────────────────────────────────────────────────
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [isAssignmentLoading, setIsAssignmentLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [assignmentError, setAssignmentError] = useState('')
  const [services, setServices] = useState([])
  const [shiftFormData, setShiftFormData] = useState({
    schedule_id: '',
    assigned_to: '',
    start_time: '',
    end_time: '',
    shift_type: 'oncall',
    service_id: ''
  })
  // ─── Unavailability modal state ──────────────────────────────────────────────
  const [showUnavailModal, setShowUnavailModal] = useState(false)
  const [unavailLoading, setUnavailLoading] = useState(false)
  const [unavailError, setUnavailError] = useState('')
  const [unavailSuccess, setUnavailSuccess] = useState('')
  const [unavailForm, setUnavailForm] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  })
  // ─── Derived: auto-resolve schedule for selected user ───────────────────────
  const selectedUserSchedule = useMemo(() => {
    if (!shiftFormData.assigned_to) return null
    return schedules.find((schedule) => {
      const ownerId = schedule.created_by ?? schedule.creator?.id
      return String(ownerId) === String(shiftFormData.assigned_to)
    }) || null
  }, [schedules, shiftFormData.assigned_to])
  // ─── Auto-fill service_id when user is selected ──────────────────────────────
  useEffect(() => {
    if (!shiftFormData.assigned_to) return
    const selectedUser = users.find((u) => String(u.id) === String(shiftFormData.assigned_to))
    const autoServiceId = selectedUser?.service_id ? String(selectedUser.service_id) : ''
    setShiftFormData((current) => ({ ...current, service_id: autoServiceId }))
  }, [shiftFormData.assigned_to, users])
  // ─── Auto-fill schedule_id when selected user changes ───────────────────────
  useEffect(() => {
    setShiftFormData((current) => ({
      ...current,
      schedule_id: selectedUserSchedule ? String(selectedUserSchedule.id) : ''
    }))
  }, [selectedUserSchedule])
  useEffect(() => {
    fetchWeeklySchedule()
  }, [])
  useEffect(() => {
    if (showShiftModal) {
      fetchUsers()
      fetchServices()
    }
  }, [showShiftModal])
  // ─── Filtered schedules ──────────────────────────────────────────────────────
  const filteredSchedules = useMemo(() => {
    const selectedDate = new Date(weekStart)
    return schedules.filter((schedule) => {
      const startDate = schedule.start_date ? new Date(schedule.start_date) : null
      return startDate ? startDate >= selectedDate : true
    })
  }, [schedules, weekStart])
  // ─── Fetch helpers ───────────────────────────────────────────────────────────
  const authHeader = () => ({
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
  })
  const fetchUsers = async () => {
    setUsersLoading(true)
    setAssignmentError('')
    try {
      const response = await fetch('/api/users', { headers: authHeader() })
      const data = await parseApiResponse(
        response,
        'Impossible de charger les utilisateurs. Verifie que le backend et MySQL sont demarres.'
      )
      const availableUsers = Array.isArray(data)
        ? data.filter((account) => ['staff', 'user'].includes(account.role))
        : []
      setUsers(availableUsers)
    } catch (err) {
      setAssignmentError(err.message)
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services', { headers: authHeader() })
      const data = await parseApiResponse(response, 'Impossible de charger les services.')
      setServices(Array.isArray(data) ? data : data.data || [])
    } catch {
      // silent — service field will just show empty
    }
  }
  // ─── Create shift ────────────────────────────────────────────────────────────
  const handleCreateShift = async (e) => {
    e.preventDefault()
    setIsAssignmentLoading(true)
    setAssignmentError('')
    try {
      const response = await fetch('/api/shifts', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...shiftFormData,
          schedule_id: shiftFormData.schedule_id ? Number(shiftFormData.schedule_id) : null,
          assigned_to: Number(shiftFormData.assigned_to),
          service_id: shiftFormData.service_id ? Number(shiftFormData.service_id) : null
        })
      })
      await parseApiResponse(
        response,
        'Erreur lors de la creation de l\'astreinte. Verifie que le backend et MySQL sont demarres.'
      )
      setShowShiftModal(false)
      setShiftFormData({ schedule_id: '', assigned_to: '', start_time: '', end_time: '', shift_type: 'oncall', service_id: '' })
      fetchWeeklySchedule()
    } catch (err) {
      setAssignmentError(err.message)
    } finally {
      setIsAssignmentLoading(false)
    }
  }
  // ─── Submit unavailability ───────────────────────────────────────────────────
  const handleSubmitUnavailability = async (e) => {
    e.preventDefault()
    setUnavailLoading(true)
    setUnavailError('')
    setUnavailSuccess('')
    try {
      const response = await fetch('/api/availabilities', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(unavailForm)
      })
      await parseApiResponse(response, 'Erreur lors de l\'envoi de la demande.')
      setUnavailSuccess('Votre demande d\'indisponibilité a été envoyée à l\'administrateur.')
      setUnavailForm({ start_date: '', end_date: '', reason: '' })
      setTimeout(() => {
        setShowUnavailModal(false)
        setUnavailSuccess('')
      }, 2000)
    } catch (err) {
      setUnavailError(err.message)
    } finally {
      setUnavailLoading(false)
    }
  }
  if (isLoading) return <LoadingSpinner />
  return (
    <div className="container mx-auto p-6">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Plannings</h1>
        <div className="flex gap-3">
          {/* Unavailability button — visible to all regular users */}
          {['user', 'staff'].includes(user?.role) && (
           <button
            onClick={() => navigate('/unavailability')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Déclarer une indisponibilité
            </button>
          )}
          {['admin', 'manager'].includes(user?.role) && (
            <button
              onClick={() => setShowShiftModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              Ajouter un planning
            </button>
          )}
        </div>
      </div>
      {/* ── Date filter ───────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">A partir du</label>
        <input
          type="date"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      {/* ── On-call status banner ─────────────────────────────────────────────── */}
      {filteredSchedules.some(s => s.shifts?.some(sh => String(sh.assigned_to) === String(user?.id))) ||
      (['user', 'staff'].includes(user?.role) && filteredSchedules.length > 0) ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg mb-6 flex items-center shadow-sm">
          <svg className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-lg">Vous êtes de garde !</h3>
            <p>Vous avez un ou plusieurs plannings assignés pour cette période.</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-4 rounded-lg mb-6 flex items-center shadow-sm">
          <svg className="w-6 h-6 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-lg">Aucune astreinte</h3>
            <p>Vous n'avez pas de planning assigné pour cette période.</p>
          </div>
        </div>
      )}
      {showUnavailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Déclarer une indisponibilité</h2>
                <p className="text-sm text-gray-500 mt-1">Votre demande sera envoyée à l'administrateur pour validation.</p>
              </div>
              <button
                onClick={() => setShowUnavailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light"
              >×</button>
            </div>
            {unavailSuccess && (
              <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {unavailSuccess}
              </div>
            )}
            {unavailError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                {unavailError}
              </div>
            )}
            <form onSubmit={handleSubmitUnavailability} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date de début</label>
                  <input
                    type="date"
                    value={unavailForm.start_date}
                    onChange={(e) => setUnavailForm({ ...unavailForm, start_date: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={unavailForm.end_date}
                    onChange={(e) => setUnavailForm({ ...unavailForm, end_date: e.target.value })}
                    required
                    min={unavailForm.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Motif / Message</label>
                <textarea
                  value={unavailForm.reason}
                  onChange={(e) => setUnavailForm({ ...unavailForm, reason: e.target.value })}
                  required
                  rows={4}
                  placeholder="Expliquez la raison de votre indisponibilité..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnavailModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={unavailLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {unavailLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Envoi...
                    </>
                  ) : 'Envoyer la demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showShiftModal && (
        <div className="bg-gray-100 border-t border-gray-300 p-6 mt-6">
          <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Ajouter un planning</h2>
              <button
                onClick={() => setShowShiftModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >×</button>
            </div>
            <form onSubmit={handleCreateShift} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User select */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Utilisateur</label>
                <select
                  value={shiftFormData.assigned_to}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, assigned_to: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">
                    {usersLoading ? 'Chargement des utilisateurs...' : 'Choisir un utilisateur'}
                  </option>
                  {users.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.role})
                    </option>
                  ))}
                </select>
              </div>
              {/* Service — auto-filled from selected user, still editable */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Service
                  {shiftFormData.service_id && (
                    <span className="ml-2 text-xs text-green-600 font-normal">✓ rempli automatiquement</span>
                  )}
                </label>
                <select
                  value={shiftFormData.service_id}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, service_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">
                    {services.length === 0 ? 'Chargement des services...' : 'Choisir un service'}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              {assignmentError && (
                <div className="md:col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {assignmentError}
                </div>
              )}
              {/* Start time */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Début</label>
                <input
                  type="datetime-local"
                  value={shiftFormData.start_time}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, start_time: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              {/* End time */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Fin</label>
                <input
                  type="datetime-local"
                  value={shiftFormData.end_time}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, end_time: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              {/* Shift type */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Type</label>
                <select
                  value={shiftFormData.shift_type}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, shift_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="oncall">On call</option>
                  <option value="day">Jour</option>
                  <option value="night">Nuit</option>
                  <option value="weekend">Weekend</option>
                </select>
              </div>
              {/* Actions */}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowShiftModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isAssignmentLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {isAssignmentLoading ? 'Création...' : 'Ajouter l\'astreinte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}