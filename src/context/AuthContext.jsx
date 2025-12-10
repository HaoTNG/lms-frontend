import { createContext, useState, useContext, useCallback, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Kiểm tra user từ /api/auth/me khi mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[AuthContext] Checking authentication...')
        const response = await authAPI.me()
        console.log('[AuthContext] Auth check response:', response)
        if (response.user) {
          console.log('[AuthContext] User found:', response.user)
          setUser(response.user)
        }
      } catch (err) {
        console.log('[AuthContext] Auth check failed:', err.message)
        // User chưa đăng nhập hoặc token hết hạn
        setUser(null)
      } finally {
        console.log('[AuthContext] Auth check complete')
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback((userData) => {
    console.log('[AuthContext] Login called with:', userData)
    setUser(userData)
    setError(null)
  }, [])

  const register = useCallback((userData) => {
    console.log('[AuthContext] Register called with:', userData)
    setUser(userData)
    setError(null)
  }, [])

  const logout = useCallback(() => {
    console.log('[AuthContext] Logout called')
    setUser(null)
    setError(null)
  }, [])

  const setAuthError = useCallback((errorMsg) => {
    console.log('[AuthContext] Error set:', errorMsg)
    setError(errorMsg)
  }, [])

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    error,
    setAuthError,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
