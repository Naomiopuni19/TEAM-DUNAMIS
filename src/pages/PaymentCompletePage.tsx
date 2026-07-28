import { useEffect, useState } from 'react'
import { useAppData } from '../context/appData'
import { api } from '../lib/api'

export function PaymentCompletePage() {
  const { token } = useAppData()
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking')
  const [amount, setAmount] = useState<number | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1])
    const reference = params.get('reference') || params.get('trxref')

    if (!token || !reference) {
      setStatus('failed')
      return
    }

    let cancelled = false
    async function run() {
      try {
        const result = await api.verifyPayment(token as string, reference as string)
        if (cancelled) return
        setStatus(result.status === 'success' ? 'success' : 'failed')
        if (result.amount) setAmount(result.amount)
      } catch {
        if (!cancelled) setStatus('failed')
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [token])

  if (status === 'checking') {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-[#745f68]" role="status">
          Confirming your payment...
        </p>
      </main>
    )
  }

  if (status === 'success') {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d92c83]">
          Payment confirmed
        </p>
        <h1 className="mt-4 font-serif text-4xl text-[#3e2530]">Thank you</h1>
        <p className="mt-4 text-sm text-[#745f68]">
          {amount
            ? 'Your payment of GHC ' + amount.toLocaleString() + ' was successful.'
            : 'Your payment was successful.'}
        </p>
          <a
          href="#/account"
          className="mt-8 rounded-full bg-[#dc2d83] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
        >
          View my account
        </a>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d92c83]">
        Payment not confirmed
      </p>
      <h1 className="mt-4 font-serif text-4xl text-[#3e2530]">Something went wrong</h1>
      <p className="mt-4 text-sm text-[#745f68]">
        We could not confirm this payment. If money left your account, please contact the salon directly.
      </p>
        <a
        href="#/account"
        className="mt-8 rounded-full border border-[#d92c83] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#d92c83]"
      >
        Go to my account
      </a>
    </main>
  )
}