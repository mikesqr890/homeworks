
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import { supabase } from '../services/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

  // Obtener sesión y escuchar cambios de autenticación
  useEffect(() => {
    let active = true

    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession()

      if (!active) return

      if (error) {
        console.error('Error al obtener sesión:', error.message)
      }

      setUser(data.session?.user ?? null)
      setProfileLoading(Boolean(data.session?.user))
      setLoading(false)
    }

    getInitialSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setProfileLoading(Boolean(session?.user))
      setLoading(false)

      if (!session) {
        setProfile(null)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  // Obtener información del perfil
  useEffect(() => {
    let active = true

    async function getProfile() {
      if (!user) {
        setProfile(null)
        setProfileLoading(false)
        return
      }

      setProfileLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!active) return

      if (error) {
        console.error('Error al obtener perfil:', error.message)
        setProfile(null)
      } else {
        setProfile(data)
      }

      setProfileLoading(false)
    }

    getProfile()

    return () => {
      active = false
    }
  }, [user])

  // Registrar usuario
  async function register(fullName, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) throw error

    return data
  }

  // Iniciar sesión
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    return data
  }

  // Cerrar sesión
  async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
