import { create } from 'zustand'

export const useScheduleStore = create((set) => ({
  schedules: [],
  isLoading: false,
  error: null,

  setSchedules: (schedules) => set({ schedules }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchWeeklySchedule: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/schedules', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || data.message || 'Impossible de charger les plannings.')
      
      // Handle both paginated response and direct array response
      const schedules = data.data || data || []
      set({ schedules: Array.isArray(schedules) ? schedules : [] })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  approveSchedule: async (scheduleId) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || data.message || 'Impossible de publier le planning.')
      
      return data.schedule
    } catch (error) {
      set({ error: error.message })
    }
  },

  clearError: () => set({ error: null })
}))
