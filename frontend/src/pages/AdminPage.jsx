import { useState, useEffect } from 'react'
import { useAuth } from '../api/authContext'
import { useServiceStore } from '../store/serviceStore'
import LoadingSpinner from '../components/LoadingSpinner'
import { importOcpServices, OCP_SERVICES } from '../utils/importOcpServices'
export default function AdminPage() {
  const { user } = useAuth()
  const { services, isLoading, error, fetchServices, createService, updateService, deleteService } = useServiceStore()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  // ─── OCP Import ──────────────────────────────────────────────────────────────
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [users, setUsers] = useState([])
  const [schedules, setSchedules] = useState([])
  const [shifts, setShifts] = useState([])
  const [assignmentError, setAssignmentError] = useState('')
  const [assignmentSuccess, setAssignmentSuccess] = useState('')
  const [isAssignmentLoading, setIsAssignmentLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  // ─── Unavailabilities ────────────────────────────────────────────────────────
  const [availabilities, setUnavailabilities] = useState([])
  const [unavailLoading, setUnavailLoading] = useState(false)
  const [unavailError, setUnavailError] = useState('')
  const [unavailSuccess, setUnavailSuccess] = useState('')
  const [respondingId, setRespondingId] = useState(null)
  const [responseMessage, setResponseMessage] = useState('')
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null) // { id, status }
  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json'
  }
  useEffect(() => {
    fetchServices()
    fetchUsers()
    fetchSchedules()
    fetchShifts()
    fetchUnavailabilities()
  }, [])
  // ─── Data fetchers ───────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', { headers: authHeaders })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Impossible de charger les utilisateurs.')
      setUsers(data.filter((item) => item.is_active))
    } catch (err) {
      setAssignmentError(err.message)
    }
  }
  const fetchShifts = async () => {
    try {
      const response = await fetch('/api/shifts', { headers: authHeaders })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Impossible de charger les astreintes.')
      setShifts(data.data || [])
    } catch (err) {
      setAssignmentError(err.message)
    }
  }
  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules', { headers: authHeaders })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Impossible de charger les plannings.')
      setSchedules(data.data || [])
    } catch (err) {
      setAssignmentError(err.message)
    }
  }
  const fetchUnavailabilities = async () => {
    setUnavailLoading(true)
    setUnavailError('')
    try {
      const response = await fetch('/api/availabilities', { headers: authHeaders })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Impossible de charger les demandes.')
      setUnavailabilities(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setUnavailError(err.message)
    } finally {
      setUnavailLoading(false)
    }
  }
  // ─── Accept / Reject unavailability ─────────────────────────────────────────
  const openResponseModal = (id, status) => {
    setPendingAction({ id, status })
    setResponseMessage('')
    setShowResponseModal(true)
  }
  const handleRespond = async () => {
    if (!pendingAction) return
    setRespondingId(pendingAction.id)
    setUnavailError('')
    setUnavailSuccess('')
    try {
      const response = await fetch(`/api/availabilities/${pendingAction.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          status: pendingAction.status,
          admin_response: responseMessage
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || data.message || 'La mise à jour a échoué.')
      setUnavailSuccess(
        pendingAction.status === 'accepted'
          ? 'Demande acceptée et notification envoyée à l\'utilisateur.'
          : 'Demande refusée et notification envoyée à l\'utilisateur.'
      )
      setShowResponseModal(false)
      await fetchUnavailabilities()
      setTimeout(() => setUnavailSuccess(''), 4000)
    } catch (err) {
      setUnavailError(err.message)
    } finally {
      setRespondingId(null)
    }
  }
  // ─── Assign user to shift ────────────────────────────────────────────────────
  const handleAssignUser = async (shiftId, assignedTo) => {
    setAssignmentError('')
    setAssignmentSuccess('')
    setIsAssignmentLoading(true)
    try {
      const response = await fetch(`/api/shifts/${shiftId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ assigned_to: assignedTo || null })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || data.message || 'La mise à jour a échoué.')
      setAssignmentSuccess('L\'utilisateur d\'astreinte a été mis à jour.')
      await fetchShifts()
    } catch (err) {
      setAssignmentError(err.message)
    } finally {
      setIsAssignmentLoading(false)
    }
  }
  // ─── Service CRUD ────────────────────────────────────────────────────────────
  // ─── OCP Import handler ──────────────────────────────────────────────────────
  const handleOcpImport = async () => {
    setShowImportConfirm(false)
    setIsImporting(true)
    setImportResult(null)
    try {
      const token = localStorage.getItem('auth_token')
      const existingNames = (services || []).map((s) => s.name)
      const result = await importOcpServices(token, existingNames)
      setImportResult(result)
      await fetchServices() // refresh list
    } catch (err) {
      setImportResult({ imported: 0, skipped: 0, errors: [err.message] })
    } finally {
      setIsImporting(false)
    }
  }

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingId(service.id)
      setFormData({ name: service.name, description: service.description || '' })
    } else {
      setEditingId(null)
      setFormData({ name: '', description: '' })
    }
    setShowModal(true)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateService(editingId, formData.name, formData.description)
      } else {
        await createService(formData.name, formData.description)
      }
      setShowModal(false)
      setFormData({ name: '', description: '' })
    } catch (err) {
      console.error('Error:', err)
    }
  }
  const handleDelete = async (serviceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        await deleteService(serviceId)
      } catch (err) {
        console.error('Error:', err)
      }
    }
  }
  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const statusBadge = (status) => {
    const map = {
      pending:  { label: 'En attente',  cls: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      accepted: { label: 'Acceptée',    cls: 'bg-green-100 text-green-700 border-green-300' },
      rejected: { label: 'Refusée',     cls: 'bg-red-100 text-red-700 border-red-300' }
    }
    const { label, cls } = map[status] || map.pending
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${cls}`}>{label}</span>
    )
  }
  const pendingCount = availabilities.filter((u) => u.status === 'pending').length
  if (!user?.role || user.role !== 'admin') {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Vous n'avez pas accès à cette page (Administrateur requis)
        </div>
      </div>
    )
  }
  if (isLoading) return <LoadingSpinner />
  return (
    <div className="container mx-auto p-6">
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Administration</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportConfirm(true)}
            disabled={isImporting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            {isImporting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Import en cours...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                Importer services OCP
              </>
            )}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Ajouter un service
          </button>
        </div>
      </div>

      {/* ── Import result banner ──────────────────────────────────────────────── */}
      {importResult && (
        <div className={`border px-4 py-3 rounded mb-4 flex items-start justify-between gap-4 ${importResult.errors.length > 0 ? 'bg-orange-50 border-orange-300 text-orange-800' : 'bg-green-50 border-green-300 text-green-800'}`}>
          <div>
            <p className="font-semibold">
              ✅ {importResult.imported} service(s) importé(s)
              {importResult.skipped > 0 && ` · ${importResult.skipped} ignoré(s) (déjà existant)`}
            </p>
            {importResult.errors.length > 0 && (
              <ul className="mt-1 text-sm list-disc list-inside">
                {importResult.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
          <button onClick={() => setImportResult(null)} className="text-lg font-bold opacity-50 hover:opacity-100">✕</button>
        </div>
      )}
      {/* ── Global alerts ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      {(assignmentError || assignmentSuccess) && (
        <div className={`border px-4 py-3 rounded mb-4 ${assignmentError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
          {assignmentError || assignmentSuccess}
        </div>
      )}
      {/* ── Stats cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Services</h3>
          <p className="text-3xl font-bold text-blue-600">{services?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Utilisateurs actifs</h3>
          <p className="text-3xl font-bold text-blue-600">{users?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Astreintes</h3>
          <p className="text-3xl font-bold text-blue-600">{shifts?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 relative">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Indisponibilités</h3>
          <p className="text-3xl font-bold text-orange-500">{availabilities?.length || 0}</p>
          {pendingCount > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </div>
      </div>
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* UNAVAILABILITY REQUESTS SECTION                                           */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              Demandes d'indisponibilité
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                  {pendingCount} en attente
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Acceptez ou refusez les demandes envoyées par les utilisateurs.
            </p>
          </div>
          <button
            onClick={fetchUnavailabilities}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
        {unavailError && (
          <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {unavailError}
          </div>
        )}
        {unavailSuccess && (
          <div className="mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {unavailSuccess}
          </div>
        )}
        {unavailLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : availabilities.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Aucune demande d'indisponibilité.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Période</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Motif</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Réponse admin</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {availabilities.map((item) => (
                  <tr key={item.id} className={`border-t hover:bg-gray-50 ${item.status === 'pending' ? 'bg-orange-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.user?.name || `Utilisateur #${item.user_id}`}</div>
                      <div className="text-xs text-gray-400">{item.user?.service?.name || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>{new Date(item.start_date).toLocaleDateString('fr-FR')}</div>
                      <div className="text-gray-400">→ {new Date(item.end_date).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <p className="line-clamp-2">{item.reason}</p>
                    </td>
                    <td className="px-6 py-4">{statusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs">
                      {item.admin_response || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openResponseModal(item.id, 'accepted')}
                            disabled={respondingId === item.id}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Accepter
                          </button>
                          <button
                            onClick={() => openResponseModal(item.id, 'rejected')}
                            disabled={respondingId === item.id}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Refuser
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Traité</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* ── Shift assignment table ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Affectation des astreintes</h2>
          <p className="text-sm text-gray-600 mt-1">L'administrateur choisit ici quel utilisateur est en astreinte.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Planning</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Début</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fin</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Utilisateur d'astreinte</th>
              </tr>
            </thead>
            <tbody>
              {shifts.length > 0 ? (
                shifts.map((shift) => (
                  <tr key={shift.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{shift.schedule?.name || `Planning #${shift.schedule_id}`}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(shift.start_time).toLocaleString('fr-FR')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(shift.end_time).toLocaleString('fr-FR')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shift.shift_type || 'oncall'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <select
                        value={shift.assigned_to || ''}
                        onChange={(e) => handleAssignUser(shift.id, e.target.value)}
                        disabled={isAssignmentLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">Sélectionner un utilisateur</option>
                        {users.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} ({account.role})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Aucune astreinte disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* RESPONSE MODAL (Accept / Reject with message)                          */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showResponseModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pendingAction.status === 'accepted' ? 'bg-green-100' : 'bg-red-100'}`}>
                {pendingAction.status === 'accepted' ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {pendingAction.status === 'accepted' ? 'Accepter la demande' : 'Refuser la demande'}
                </h2>
                <p className="text-sm text-gray-500">Un message sera envoyé à l'utilisateur.</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Message pour l'utilisateur <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={3}
                placeholder={
                  pendingAction.status === 'accepted'
                    ? 'Ex : Votre indisponibilité a bien été prise en compte.'
                    : 'Ex : Nous ne pouvons pas accepter votre demande pour cette période.'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            {unavailError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {unavailError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleRespond}
                disabled={respondingId !== null}
                className={`flex-1 text-white px-4 py-2 rounded-lg transition font-medium disabled:opacity-50 ${
                  pendingAction.status === 'accepted'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {respondingId !== null
                  ? 'Envoi...'
                  : pendingAction.status === 'accepted'
                    ? 'Confirmer l\'acceptation'
                    : 'Confirmer le refus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Service create/edit modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Éditer le service' : 'Ajouter un service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Nom du service"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  {editingId ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── OCP Import confirmation modal ──────────────────────────────────────── */}
      {showImportConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Importer les services OCP</h2>
                <p className="text-sm text-gray-500">Site de Benguerir — Octobre 2025</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-green-700">{OCP_SERVICES.length} services</span> vont être importés depuis le tableau de garde OCP (MIG/B, MIG/M, FIM…).
              </p>
              <p className="text-xs text-gray-500">Les services déjà existants seront automatiquement ignorés (pas de doublons).</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleOcpImport}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Confirmer l'import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
