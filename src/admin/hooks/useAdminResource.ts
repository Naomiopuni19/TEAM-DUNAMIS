import { useCallback, useEffect, useState } from 'react'
import { useAppData } from '../../context/appData'

export function useAdminResource<T>(loader: (token: string) => Promise<T>) {
  const { token } = useAppData()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      setData(await loader(token))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load data.')
    } finally {
      setLoading(false)
    }
  }, [loader, token])

  useEffect(() => {
    if (!token) return
    let current = true
    loader(token)
      .then((result) => {
        if (current) setData(result)
      })
      .catch((reason) => {
        if (current) {
          setError(
            reason instanceof Error ? reason.message : 'Unable to load data.',
          )
        }
      })
      .finally(() => {
        if (current) setLoading(false)
      })
    return () => {
      current = false
    }
  }, [loader, token])

  return { data, setData, loading, error, setError, reload, token }
}
