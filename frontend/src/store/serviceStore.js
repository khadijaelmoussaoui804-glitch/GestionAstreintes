import { create } from 'zustand'

export const useServiceStore = create((set) => ({
  services: [],
  isLoading: false,
  error: null,

  setServices: (services) => set({ services }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchServices: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/services', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || data.message || 'Impossible de charger les services.')
      
      set({ services: data })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  createService: async (name, description) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description
        })
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || data.message || 'Impossible de creer le service.')
      
      set((state) => ({
        services: [...state.services, data.service]
      }))
      return data.service
    } catch (error) {
      set({ error: error.message })
    }
  },

  updateService: async (serviceId, name, description) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description
        })
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || data.message || 'Impossible de modifier le service.')
      
      set((state) => ({
        services: state.services.map(s => s.id === serviceId ? data.service : s)
      }))
      return data.service
    } catch (error) {
      set({ error: error.message })
    }
  },

  deleteService: async (serviceId) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to delete service')
      
      set((state) => ({
        services: state.services.filter(s => s.id !== serviceId)
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  clearError: () => set({ error: null })
}))
