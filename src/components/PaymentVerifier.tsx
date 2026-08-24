import { useEffect, useRef, useState } from 'react'
import { useAppData } from '../context/appData'
import { api } from '../lib/api'

function wait(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms) })
}

export function PaymentVerifier() {
  const { token } = useAppData()
  const [notice, setNotice] = useState<string | null>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!token) return
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference') || params.get('trxref')
    if (!reference) return
    if (hasRun.current) return
    hasRun.current = true
    let cancelled = false

    async function run() {
      const cleanUrl = window.location.pathname + window.location.hash
      window.history.replaceState({}, '', cleanUrl)

      const attemptDelaysMs = [0, 2500, 4000, 5000]
      let lastResult = null

      for (let i = 0; i < attemptDelaysMs.length; i++) {
        if (cancelled) return
        if (attemptDelaysMs[i] > 0) await wait(attemptDelaysMs[i])
        if (cancelled) return
        try {
          lastResult = await api.verifyPayment(token as string, reference as string)
          if (lastResult.status === 'success') {
            setNotice('Payment confirmed, thank you.')
            return
          }
        } catch {
          // keep retrying, Paystack may just need a moment
        }
      }

      if (!cancelled) {
        setNotice('We could not confirm that payment. If money left your account, please contact the salon.')
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [token])

  if (!notice) return null
  return (
    <div className="fixed inset-x-0 top-0 z-[100] bg-[#3e2530] px-4 py-3 text-center text-sm text-white">
      {notice}
      <button
        type="button"
        onClick={() => setNotice(null)}
        className="ml-4 underline"
      >
        Dismiss
      </button>
    </div>
  )
}