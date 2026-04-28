import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../api/client'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem('auth_token'),
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        localStorage.setItem('auth_token', token)
        set({ token })
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.login(email, password)
          const data = response.data

          set({ user: data.user, token: data.token })
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('auth_token', data.token)
        } catch (error) {
          const message =
            error.response?.data?.message ||
            Object.values(error.response?.data?.errors || {}).flat()[0] ||
            error.message ||
            'Login failed'

          set({ error: message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (name, email, password, serviceId) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.register({
            name,
            email,
            password,
            service_id: serviceId
          })
          const data = response.data

          set({ user: data.user, token: data.token })
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('auth_token', data.token)
        } catch (error) {
          const message =
            error.response?.data?.message ||
            Object.values(error.response?.data?.errors || {}).flat()[0] ||
            error.message ||
            'Registration failed'

          set({ error: message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          set({ user: null, token: null })
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-store'
    }
  )
)
