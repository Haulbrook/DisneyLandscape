import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

// Master admin email
const ADMIN_EMAIL = 'haulbrookai@gmail.com'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId) => {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error fetching profile:', err)
      return null
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setProfile(profile)
      }

      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setProfile(profile)
        } else {
          setProfile(null)
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // Sign up with email and password
  const signUp = async (email, password, fullName = '') => {
    if (!supabase) {
      throw new Error('Authentication not configured')
    }

    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) {
      setError(error.message)
      throw error
    }

    return data
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    if (!supabase) {
      throw new Error('Authentication not configured')
    }

    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      throw error
    }

    return data
  }

  // Sign out
  const signOut = async () => {
    if (!supabase) return

    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
      throw error
    }

    setUser(null)
    setSession(null)
    setProfile(null)
  }

  // Reset password (send email)
  const resetPassword = async (email) => {
    if (!supabase) {
      throw new Error('Authentication not configured')
    }

    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      setError(error.message)
      throw error
    }
  }

  // Update password (after reset)
  const updatePassword = async (newPassword) => {
    if (!supabase) {
      throw new Error('Authentication not configured')
    }

    setError(null)

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setError(error.message)
      throw error
    }
  }

  // Update profile
  const updateProfile = async (updates) => {
    if (!supabase || !user) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    setProfile(data)
    return data
  }

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin' || user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
