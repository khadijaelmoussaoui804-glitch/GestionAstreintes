import { create } from 'zustand'

export const useAgentStore = create((set) => ({
  agents: [],
  isLoading: false,
  error: null,

  setAgents: (agents) => set({ agents }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchAgents: async (serviceId) => {
    set({ isLoading: true, error: null })
    try {
      const params = new URLSearchParams()
      if (serviceId) params.append('service_id', serviceId)

      const response = await fetch(`/api/agents?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      set({ agents: data })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  createAgent: async (userId, serviceId, rotationOrder) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          service_id: serviceId,
          rotation_order: rotationOrder
        })
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      set((state) => ({
        agents: [...state.agents, data.agent]
      }))
      return data.agent
    } catch (error) {
      set({ error: error.message })
    }
  },

  declareUnavailability: async (agentId, date, reason) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/unavailability`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date,
          reason
        })
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      return data.unavailability
    } catch (error) {
      set({ error: error.message })
    }
  },

  clearError: () => set({ error: null })
}))