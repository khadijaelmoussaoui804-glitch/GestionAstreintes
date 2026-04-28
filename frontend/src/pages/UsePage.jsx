import { useState, useEffect } from 'react'
import { useAuth } from '../api/authContext'

const STATUS_CONFIG = {
  pending: {
    label: 'En attente',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    card: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700 border-amber-300',
    dot: 'bg-amber-400',
  },
  accepted: {
    label: 'Acceptée',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    card: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Refusée',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    card: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700 border-red-300',
    dot: 'bg-red-400',
  },
}
const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

const daysBetween = (a, b) => {
  const ms = new Date(b) - new Date(a)
  return Math.max(1, Math.round(ms / 86400000) + 1)
}
export default function UserPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ start_date: '', end_date: '', reason: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [selected, setSelected] = useState(null)
  const authHeader = () => ({
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
  })
  const fetchRequests = async () => {
    setListLoading(true)
    setListError('')
    try {
      const res = await fetch('/api/availabilities', { headers: authHeader() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur de chargement.')
      setRequests(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setListError(err.message)
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.end_date < formData.start_date) {
      setFormError('La date de fin doit être après la date de début.')
      return
    }
    setFormLoading(true)
    setFormError('')
    setFormSuccess('')
    try {
      const res = await fetch('/api/availabilities', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || data.message || 'Erreur lors de l\'envoi.')
      setFormSuccess('Votre demande a été envoyée à l\'administrateur.')
      setFormData({ start_date: '', end_date: '', reason: '' })
      setShowForm(false)
      await fetchRequests()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const pending = requests.filter((r) => r.status === 'pending').length
  const accepted = requests.filter((r) => r.status === 'accepted').length
  const rejected = requests.filter((r) => r.status === 'rejected').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes indisponibilités</h1>
              <p className="text-gray-500 mt-1">
                Bonjour <span className="font-medium text-gray-700">{user?.name}</span> — gérez vos demandes d'absence ici.
              </p>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess('') }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                showForm
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'
              }`}
            >
              {showForm ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Annuler
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Nouvelle demande
                </>
              )}
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'En attente', value: pending,  color: 'text-amber-600',  bg: 'bg-amber-50  border-amber-200'  },
              { label: 'Acceptées',  value: accepted, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
              { label: 'Refusées',   value: rejected, color: 'text-red-600',    bg: 'bg-red-50    border-red-200'    },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} border rounded-xl px-4 py-3 text-center`}>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
        {formSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-700 px-5 py-3 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {formSuccess}
          </div>
        )}
        {showForm && (
          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm mb-8 overflow-hidden">
            {/* Form header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Déclarer une indisponibilité
              </h2>
              <p className="text-orange-100 text-sm mt-0.5">
                Votre demande sera transmise à l'administrateur pour validation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Date de début <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    min={today}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Date de fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    min={formData.start_date || today}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Duration preview */}
              {formData.start_date && formData.end_date && formData.end_date >= formData.start_date && (
                <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-2.5 text-sm text-orange-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Durée : <strong>{daysBetween(formData.start_date, formData.end_date)} jour(s)</strong>
                  &nbsp;— du <strong>{fmt(formData.start_date)}</strong> au <strong>{fmt(formData.end_date)}</strong>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Motif / Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  rows={4}
                  placeholder="Décrivez la raison de votre indisponibilité (congés, rendez-vous médical, formation…)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{formData.reason.length} caractère(s)</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Envoyer la demande
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        {listError && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-5 py-3 rounded-xl mb-4 text-sm">
            {listError}
          </div>
        )}
        {listLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="animate-spin w-8 h-8 mb-3 text-orange-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Chargement des demandes…
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Aucune demande pour le moment</p>
            <p className="text-gray-400 text-sm mt-1">Cliquez sur "Nouvelle demande" pour commencer.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending
              const days = daysBetween(req.start_date, req.end_date)
              return (
                <button
                  key={req.id}
                  onClick={() => setSelected(req)}
                  className={`w-full text-left border rounded-2xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${cfg.card}`}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    {/* Left: dates + reason */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                          {cfg.label}
                        </span>
                        {/* Days count */}
                        <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-full">
                          {days} jour{days > 1 ? 's' : ''}
                        </span>
                      </div>

                      <p className="font-semibold text-gray-800 text-sm">
                        {fmt(req.start_date)} → {fmt(req.end_date)}
                      </p>

                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{req.reason}</p>
                    </div>

                    {/* Right: status icon + arrow */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.badge}`}>
                        {cfg.icon}
                      </div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Admin response preview — only if replied */}
                  {req.admin_response && (
                    <div className={`mt-3 pt-3 border-t ${req.status === 'accepted' ? 'border-emerald-200' : 'border-red-200'}`}>
                      <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Réponse de l'administrateur</p>
                      <p className="text-sm text-gray-700 italic">"{req.admin_response}"</p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header — colored by status */}
            {(() => {
              const cfg = STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending
              const statusColors = {
                pending:  'from-amber-500  to-amber-400',
                accepted: 'from-emerald-500 to-emerald-400',
                rejected: 'from-red-500    to-red-400',
              }
              const days = daysBetween(selected.start_date, selected.end_date)
              return (
                <>
                  <div className={`bg-gradient-to-r ${statusColors[selected.status] || statusColors.pending} px-6 py-5`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        {cfg.icon}
                        <span className="font-bold text-lg">{cfg.label}</span>
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        className="text-white/70 hover:text-white text-2xl font-light leading-none"
                      >×</button>
                    </div>
                    <p className="text-white/80 text-sm mt-1">
                      {days} jour{days > 1 ? 's' : ''} · du {fmt(selected.start_date)} au {fmt(selected.end_date)}
                    </p>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Reason */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Votre message</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                        {selected.reason}
                      </div>
                    </div>

                    {/* Admin response */}
                    {selected.admin_response ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                          Réponse de l'administrateur
                        </p>
                        <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed border ${
                          selected.status === 'accepted'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p>{selected.admin_response}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        En attente de réponse de l'administrateur…
                      </div>
                    )}

                    <button
                      onClick={() => setSelected(null)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition"
                    >
                      Fermer
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}