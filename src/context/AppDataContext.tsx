import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Product, Service, User } from '../data/catalog'
import { api } from '../lib/api'
import { AppDataContext } from './appData'

const tokenStorageKey = 'beryl-auth-token'
const userStorageKey = 'beryl-auth-user'

function storedUser() {
  try {
    const value = sessionStorage.getItem(userStorageKey)
    return value ? (JSON.parse(value) as User) : null
  } catch {
    return null
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(tokenStorageKey),
  )
  const [user, setUser] = useState<User | null>(storedUser)
  const [authLoading, setAuthLoading] = useState(() => Boolean(token))

  async function refreshCatalog() {
    setCatalogLoading(true)
    setCatalogError('')
    try {
      const [nextProducts, nextServices] = await Promise.all([
        api.products(),
        api.services(),
      ])
      setProducts(nextProducts)
      setServices(nextServices)
    } catch (error) {
      setCatalogError(
        error instanceof Error
          ? error.message
          : 'The salon catalogue is temporarily unavailable.',
      )
    } finally {
      setCatalogLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([api.products(), api.services()])
      .then(([nextProducts, nextServices]) => {
        setProducts(nextProducts)
        setServices(nextServices)
      })
      .catch((error: unknown) => {
        setCatalogError(
          error instanceof Error
            ? error.message
            : 'The salon catalogue is temporarily unavailable.',
        )
      })
      .finally(() => setCatalogLoading(false))
  }, [])

  useEffect(() => {
    if (!token) return
    api
      .me(token)
      .then(({ user: verifiedUser }) => {
        sessionStorage.setItem(userStorageKey, JSON.stringify(verifiedUser))
        setUser(verifiedUser)
      })
      .catch(() => {
        sessionStorage.removeItem(tokenStorageKey)
        sessionStorage.removeItem(userStorageKey)
        setToken(null)
        setUser(null)
      })
      .finally(() => setAuthLoading(false))
  }, [token])

  function saveSession(nextUser: User, nextToken: string) {
    sessionStorage.setItem(tokenStorageKey, nextToken)
    sessionStorage.setItem(userStorageKey, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  async function login(phone: string, password: string) {
    const result = await api.login(phone, password)
    saveSession(result.user, result.token)
    return result.user
  }

  async function register(name: string, phone: string, password: string) {
    const result = await api.register(name, phone, password)
    saveSession(result.user, result.token)
    return result.user
  }

  async function updateProfile(name: string, phone: string) {
    if (!token) throw new Error('Sign in to update your profile.')
    const result = await api.updateProfile(token, { name, phone })
    sessionStorage.setItem(userStorageKey, JSON.stringify(result.user))
    setUser(result.user)
    return result.user
  }

  async function changePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    if (!token) throw new Error('Sign in to change your password.')
    const result = await api.changePassword(token, {
      currentPassword,
      newPassword,
    })
    return result.message
  }

  function logout() {
    sessionStorage.removeItem(tokenStorageKey)
    sessionStorage.removeItem(userStorageKey)
    setToken(null)
    setUser(null)
  }

  const value = {
    products,
    services,
    catalogLoading,
    catalogError,
    user,
    token,
    authLoading,
    login,
    register,
    updateProfile,
    changePassword,
    logout,
    refreshCatalog,
  }

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  )
}
