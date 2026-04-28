import { create } from 'zustand'

const POLL_INTERVAL = 15000 // 15 seconds
const fetchWithAuth = (url) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
  })
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  pollingTimer: null,
  lastChecked: Date.now(),
  addNotification: (notif) => {
    const id = Date.now() + Math.random()
    set((state) => ({
      notifications: [{ id, read: false, timestamp: Date.now(), ...notif }, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }))
  },
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  markRead: (id) =>
    set((state) => {
      const notif = state.notifications.find((n) => n.id === id)
      if (!notif || notif.read) return state
      return {
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }
    }),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
  // ─── Admin polling: detect new unavailabilities ───────────────────────────
  pollAvailabilities: async () => {
    const { lastChecked, addNotification } = get()
    try {
      const res = await fetchWithAuth('/api/availabilities')
      if (!res.ok) return
      const data = await res.json()
      const items = Array.isArray(data) ? data : data.data || []
      const newItems = items.filter((a) => new Date(a.created_at).getTime() > lastChecked)
      newItems.forEach((a) => {
        addNotification({
          type: 'unavailability',
          title: 'Nouvelle indisponibilité',
          message: `${a.user?.name || 'Un utilisateur'} a déclaré une indisponibilité le ${new Date(a.date).toLocaleDateString('fr-FR')}`,
          avatar: a.user?.profile_picture || null,
          initials: (a.user?.name || 'U').charAt(0).toUpperCase(),
        })
      })
    } catch (_) {}
    set({ lastChecked: Date.now() })
  },
  // ─── User polling: detect new shift assignments ───────────────────────────
  pollShifts: async (userId) => {
    const { lastChecked, addNotification } = get()
    try {
      const res = await fetchWithAuth('/api/shifts')
      if (!res.ok) return
      const data = await res.json()
      const items = Array.isArray(data) ? data : data.data || []
      const newShifts = items.filter(
        (s) =>
          String(s.assigned_to) === String(userId) &&
          s.updated_at &&
          new Date(s.updated_at).getTime() > lastChecked
      )
      newShifts.forEach((s) => {
        const start = new Date(s.start_time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
        addNotification({
          type: 'shift',
          title: 'Nouvelle astreinte assignée',
          message: `Vous êtes assigné à une astreinte débutant le ${start}`,
          avatar: null,
          initials: '📅',
        })
      })
    } catch (_) {}
    set({ lastChecked: Date.now() })
  },
  // ─── Start / stop polling ─────────────────────────────────────────────────
  startPolling: (user) => {
    const { stopPolling, pollAvailabilities, pollShifts } = get()
    stopPolling()
    const tick = () => {
      if (user?.role === 'admin' || user?.role === 'manager') {
        pollAvailabilities()
      } else {
        pollShifts(user?.id)
      }
    }
    // Initial poll after a short delay 
    const initTimer = setTimeout(tick, 3000)
    const timer = setInterval(tick, POLL_INTERVAL)
    set({ pollingTimer: { interval: timer, timeout: initTimer }, lastChecked: Date.now() })
  },
  stopPolling: () => {
    const { pollingTimer } = get()
    if (pollingTimer?.interval) clearInterval(pollingTimer.interval)
    if (pollingTimer?.timeout) clearTimeout(pollingTimer.timeout)
    set({ pollingTimer: null })
  },
}))